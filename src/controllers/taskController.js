const Task = require('../models/Task');
const Employee = require('../models/Employee');
const Performance = require('../models/Performance');
const emailTemplates = require('../models/emailTemplate');
const emailService = require('../utils/emailService');

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
exports.getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find()
      .populate('assigneeId', 'name email')
      .populate('comments.authorId', 'name email')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get my tasks (tasks assigned to current user)
// @route   GET /api/tasks/me/assigned
// @access  Private
exports.getMyTasks = async (req, res, next) => {
  try {
    // Find employee by userId first, then by email if not found
    let employee = await Employee.findOne({ userId: req.user._id });
    
    if (!employee) {
      // Try to find by email as backup
      employee = await Employee.findOne({ email: req.user.email });
    }

    if (!employee) {
      return res.status(404).json({
        success: true,
        count: 0,
        data: [],
        message: 'Aucune fiche employé trouvée pour cet utilisateur'
      });
    }

    // Get all tasks assigned to this employee
    const tasks = await Task.find({ assigneeId: employee._id })
      .populate('assigneeId', 'name email')
      .populate('comments.authorId', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
      employeeId: employee._id
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
exports.getTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assigneeId', 'name email role')
      .populate('comments.authorId', 'name email');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
exports.createTask = async (req, res, next) => {
  try {
    // Verify assignee exists
    const assignee = await Employee.findById(req.body.assigneeId);

    if (!assignee) {
      return res.status(404).json({
        success: false,
        message: 'Assignee not found'
      });
    }

    const task = await Task.create(req.body);

    // Send email notification to assignee
    try {
      const emailTemplate = emailTemplates.taskAssigned(task, assignee);
      await emailService.sendEmail({
        to: assignee.email,
        subject: emailTemplate.subject,
        html: emailTemplate.html,
        text: emailTemplate.text,
      });
    } catch (emailError) {
      console.error('Failed to send email notification:', emailError);
    }

    const populatedTask = await task.populate('assigneeId', 'name email');

    res.status(201).json({
      success: true,
      data: populatedTask
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
exports.updateTask = async (req, res, next) => {
  try {
    // If assigneeId is being updated, verify it exists
    if (req.body.assigneeId) {
      const assignee = await Employee.findById(req.body.assigneeId);
      if (!assignee) {
        return res.status(404).json({
          success: false,
          message: 'Assignee not found'
        });
      }
    }

    const oldTask = await Task.findById(req.params.id).populate('assigneeId');
    
    if (!oldTask) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Prevent updating a completed task unless it's status change
    if (oldTask.status === 'completed' && req.body.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot modify a completed task'
      });
    }

    // If completing the task, set completedAt
    if (req.body.status === 'completed' && oldTask.status !== 'completed') {
      req.body.completedAt = new Date();
    }

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate('assigneeId').populate('comments.authorId', 'name email');

    // Send email notification if status changed
    if (req.body.status && req.body.status !== oldTask.status) {
      try {
        const assignee = task.assigneeId;
        const emailTemplate = emailTemplates.taskStatusChanged(task, assignee, req.body.status);
        await emailService.sendEmail({
          to: assignee.email,
          subject: emailTemplate.subject,
          html: emailTemplate.html,
          text: emailTemplate.text,
        });
      } catch (emailError) {
        console.error('Failed to send email notification:', emailError);
      }

      // Recalculate performance if status changed to completed
      if (req.body.status === 'completed' && task.assigneeId) {
        try {
          // Calculate current month performance
          const now = new Date();
          const currentPeriod = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
          
          const employeeTasks = await Task.find({ assigneeId: task.assigneeId });
          const periodTasks = employeeTasks.filter(t => {
            const taskDate = new Date(t.createdAt);
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
            const completed = new Date(t.completedAt || t.updatedAt || t.createdAt);
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

          await Performance.findOneAndUpdate(
            { employeeId: task.assigneeId, period: currentPeriod, periodType: 'monthly' },
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
        } catch (perfError) {
          console.error('Failed to update performance:', perfError);
        }
      }
    }

    res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add comment to task
// @route   POST /api/tasks/:id/comments
// @access  Private
exports.addComment = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id).populate('assigneeId');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Prevent adding comments to completed tasks
    if (task.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot add comments to completed tasks'
      });
    }

    const comment = {
      authorId: req.body.authorId,
      author: req.body.author,
      content: req.body.content,
      createdAt: new Date()
    };

    task.comments.push(comment);
    const updatedTask = await task.save();

    const populatedTask = await updatedTask.populate('comments.authorId', 'name email');

    res.status(200).json({
      success: true,
      data: populatedTask
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

