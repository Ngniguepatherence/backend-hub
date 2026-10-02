const Employee = require('../models/Employee');
const User = require('../models/User');

// @desc    Get all employees
// @route   GET /api/employees
// @access  Private
exports.getEmployees = async (req, res, next) => {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: employees.length,
      data: employees
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single employee
// @route   GET /api/employees/:id
// @access  Private
exports.getEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    res.status(200).json({
      success: true,
      data: employee
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new employee
// @route   POST /api/employees
// @access  Private
exports.createEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.create(req.body);

    res.status(201).json({
      success: true,
      data: employee
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create employee with user account
// @route   POST /api/employees/create-with-user
// @access  Private
exports.createEmployeeWithUser = async (req, res, next) => {
  try {
    const { email, password, role, name, ...employeeData } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Un utilisateur avec cet email existe déjà'
      });
    }

    // Create user account
    const user = await User.create({
      name,
      email,
      password,
      role
    });

    // Create employee record with userId
    const employee = await Employee.create({
      name,
      email,
      userId: user._id,
      ...employeeData
    });

    res.status(201).json({
      success: true,
      data: {
        employee,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      },
      message: 'Employé et compte utilisateur créés avec succès'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update employee
// @route   PUT /api/employees/:id
// @access  Private
exports.updateEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    res.status(200).json({
      success: true,
      data: employee
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete employee
// @route   DELETE /api/employees/:id
// @access  Private
exports.deleteEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Employee deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Sync employee userId with user email
// @route   POST /api/employees/sync/userid
// @access  Private (Admin only)
exports.syncEmployeeUserId = async (req, res, next) => {
  try {
    const employees = await Employee.find();
    let updatedCount = 0;

    for (const employee of employees) {
      if (!employee.userId) {
        // Find user by email
        const user = await User.findOne({ email: employee.email });
        if (user) {
          employee.userId = user._id;
          await employee.save();
          updatedCount++;
        }
      }
    }

    res.status(200).json({
      success: true,
      message: `${updatedCount} employees updated with userId`,
      updatedCount
    });
  } catch (error) {
    next(error);
  }
};

