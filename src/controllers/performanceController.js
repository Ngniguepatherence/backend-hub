const Performance = require('../models/Performance');
const Task = require('../models/Task');
const Employee = require('../models/Employee');

// @desc    Calculate and update performance for an employee
// @route   POST /api/performance/calculate/:employeeId
// @access  Private
exports.calculatePerformance = async (req, res, next) => {
  try {
    const { employeeId } = req.params;
    const { period, periodType = 'monthly' } = req.body;

    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    // Get current period if not provided
    const now = new Date();
    let currentPeriod = period;
    if (!currentPeriod) {
      if (periodType === 'monthly') {
        currentPeriod = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      } else {
        const week = Math.ceil(now.getDate() / 7);
        currentPeriod = `${now.getFullYear()}-${String(week).padStart(2, '0')}`;
      }
    }

    // Get all tasks for this employee
    const employeeTasks = await Task.find({ assigneeId: employeeId });

    // Filter tasks by period
    const periodTasks = employeeTasks.filter(task => {
      const taskDate = new Date(task.createdAt);
      if (periodType === 'monthly') {
        const taskPeriod = `${taskDate.getFullYear()}-${String(taskDate.getMonth() + 1).padStart(2, '0')}`;
        return taskPeriod === currentPeriod;
      } else {
        const week = Math.ceil(taskDate.getDate() / 7);
        const taskPeriod = `${taskDate.getFullYear()}-${String(week).padStart(2, '0')}`;
        return taskPeriod === currentPeriod;
      }
    });

    // Calculate metrics
    const totalTasks = periodTasks.length;
    const completedTasks = periodTasks.filter(t => t.status === 'completed').length;
    const inProgressTasks = periodTasks.filter(t => t.status === 'in_progress').length;
    const pendingTasks = periodTasks.filter(t => t.status === 'pending').length;
    
    const nowDate = new Date();
    const overdueTasks = periodTasks.filter(t => {
      if (t.status === 'completed') return false;
      return new Date(t.dueDate) < nowDate;
    }).length;

    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Calculate on-time completion rate
    const completedWithDates = periodTasks.filter(t => t.status === 'completed' && t.createdAt && t.dueDate);
    const onTimeCompleted = completedWithDates.filter(t => {
      const due = new Date(t.dueDate);
      const completed = new Date(t.updatedAt || t.createdAt);
      return completed <= due;
    }).length;
    const onTimeRate = completedTasks > 0 ? Math.round((onTimeCompleted / completedTasks) * 100) : 0;

    // Calculate average completion time
    const avgCompletionTime = completedWithDates.length > 0
      ? completedWithDates.reduce((sum, t) => {
          const created = new Date(t.createdAt);
          const due = new Date(t.dueDate);
          const diffDays = Math.max(0, (due.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
          return sum + diffDays;
        }, 0) / completedWithDates.length
      : 0;

    // Calculate tasks completed this period
    const tasksThisPeriod = completedWithDates.length;

    // Determine performance level
    let performanceLevel = 'average';
    if (completionRate >= 90 && onTimeRate >= 80 && overdueTasks === 0) {
      performanceLevel = 'excellent';
    } else if (completionRate >= 75 && onTimeRate >= 60 && overdueTasks <= 2) {
      performanceLevel = 'good';
    } else if (completionRate < 50 || overdueTasks > 5) {
      performanceLevel = 'needs_improvement';
    }

    // Update or create performance record
    const performance = await Performance.findOneAndUpdate(
      { employeeId, period, periodType },
      {
        totalTasks,
        completedTasks,
        inProgressTasks,
        pendingTasks,
        overdueTasks,
        completionRate,
        onTimeRate,
        avgCompletionTime: Math.round(avgCompletionTime * 10) / 10,
        tasksThisPeriod,
        performanceLevel
      },
      { new: true, upsert: true }
    );

    res.status(200).json({
      success: true,
      data: performance
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get performance for an employee
// @route   GET /api/performance/:employeeId
// @access  Private
exports.getEmployeePerformance = async (req, res, next) => {
  try {
    const { employeeId } = req.params;
    const { period, periodType = 'monthly' } = req.query;

    const query = { employeeId };
    if (period) {
      query.period = period;
      query.periodType = periodType;
    }

    const performances = await Performance.find(query)
      .populate('employeeId', 'name email position department')
      .sort({ period: -1 });

    res.status(200).json({
      success: true,
      count: performances.length,
      data: performances
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all performances
// @route   GET /api/performance
// @access  Private
exports.getAllPerformances = async (req, res, next) => {
  try {
    const { period, periodType = 'monthly' } = req.query;

    const query = {};
    if (period) {
      query.period = period;
      query.periodType = periodType;
    }

    const performances = await Performance.find(query)
      .populate('employeeId', 'name email position department')
      .sort({ completionRate: -1 });

    res.status(200).json({
      success: true,
      count: performances.length,
      data: performances
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Recalculate all performances
// @route   POST /api/performance/recalculate
// @access  Private
exports.recalculateAllPerformances = async (req, res, next) => {
  try {
    const employees = await Employee.find({ status: 'active' });
    const results = [];

    for (const employee of employees) {
      try {
        // Calculate current month performance
        const now = new Date();
        const currentPeriod = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        
        const employeeTasks = await Task.find({ assigneeId: employee._id });
        const periodTasks = employeeTasks.filter(task => {
          const taskDate = new Date(task.createdAt);
          const taskPeriod = `${taskDate.getFullYear()}-${String(taskDate.getMonth() + 1).padStart(2, '0')}`;
          return taskPeriod === currentPeriod;
        });

        const totalTasks = periodTasks.length;
        const completedTasks = periodTasks.filter(t => t.status === 'completed').length;
        const inProgressTasks = periodTasks.filter(t => t.status === 'in_progress').length;
        const pendingTasks = periodTasks.filter(t => t.status === 'pending').length;
        
        const nowDate = new Date();
        const overdueTasks = periodTasks.filter(t => {
          if (t.status === 'completed') return false;
          return new Date(t.dueDate) < nowDate;
        }).length;

        const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

        const completedWithDates = periodTasks.filter(t => t.status === 'completed' && t.createdAt && t.dueDate);
        const onTimeCompleted = completedWithDates.filter(t => {
          const due = new Date(t.dueDate);
          const completed = new Date(t.updatedAt || t.createdAt);
          return completed <= due;
        }).length;
        const onTimeRate = completedTasks > 0 ? Math.round((onTimeCompleted / completedTasks) * 100) : 0;

        const avgCompletionTime = completedWithDates.length > 0
          ? completedWithDates.reduce((sum, t) => {
              const created = new Date(t.createdAt);
              const due = new Date(t.dueDate);
              const diffDays = Math.max(0, (due.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
              return sum + diffDays;
            }, 0) / completedWithDates.length
          : 0;

        let performanceLevel = 'average';
        if (completionRate >= 90 && onTimeRate >= 80 && overdueTasks === 0) {
          performanceLevel = 'excellent';
        } else if (completionRate >= 75 && onTimeRate >= 60 && overdueTasks <= 2) {
          performanceLevel = 'good';
        } else if (completionRate < 50 || overdueTasks > 5) {
          performanceLevel = 'needs_improvement';
        }

        const performance = await Performance.findOneAndUpdate(
          { employeeId: employee._id, period: currentPeriod, periodType: 'monthly' },
          {
            totalTasks,
            completedTasks,
            inProgressTasks,
            pendingTasks,
            overdueTasks,
            completionRate,
            onTimeRate,
            avgCompletionTime: Math.round(avgCompletionTime * 10) / 10,
            tasksThisPeriod: completedWithDates.length,
            performanceLevel
          },
          { new: true, upsert: true }
        );

        results.push({ employeeId: employee._id, success: true, performance });
      } catch (error) {
        results.push({ employeeId: employee._id, success: false, error: error.message });
      }
    }

    res.status(200).json({
      success: true,
      message: 'Performance recalculation completed',
      results
    });
  } catch (error) {
    next(error);
  }
};
