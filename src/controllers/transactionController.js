const Transaction = require('../models/Transaction');
const Client = require('../models/Client');
const Student = require('../models/Student');
const Project = require('../models/Project');

// @desc    Get all transactions
// @route   GET /api/transactions
// @access  Private
exports.getTransactions = async (req, res, next) => {
  try {
    const transactions = await Transaction.find()
      .populate('approvedBy', 'name email')
      .populate('bookingId', 'spaceName clientName date startTime endTime totalPrice')
      .populate('studentProgramId', 'name program university')
      .populate('projectId', 'title client type budget status')
      .populate('clientId', 'name company')
      .sort({ date: -1 });
    
    res.status(200).json({
      success: true,
      count: transactions.length,
      data: transactions
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single transaction
// @route   GET /api/transactions/:id
// @access  Private
exports.getTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findById(req.params.id)
      .populate('approvedBy', 'name email role')
      .populate('bookingId', 'spaceName clientName date startTime endTime totalPrice')
      .populate('studentProgramId', 'name program university')
      .populate('projectId', 'title client type budget status')
      .populate('clientId', 'name company');

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    res.status(200).json({
      success: true,
      data: transaction
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new transaction
// @route   POST /api/transactions
// @access  Private
exports.createTransaction = async (req, res, next) => {
  try {
    const Booking = require('../models/Booking');
    let clientId = req.body.clientId;
    
    // If bookingId is provided, get clientId from booking
    if (req.body.bookingId && !clientId) {
      const booking = await Booking.findById(req.body.bookingId);
      if (booking) {
        clientId = booking.clientId;
      }
    }
    
    // If projectId is provided, get clientId from project
    if (req.body.projectId && !clientId) {
      const project = await Project.findById(req.body.projectId);
      if (project) {
        clientId = project.clientId;
      }
    }
    
    // For student programs, we use the clientId provided (students don't have direct clientId)
    // The clientId should be provided in the request for student program transactions
    // ClientId is now optional - transactions can be recorded without a client for general services

    // Create transaction with clientId (can be null for general services)
    const transactionData = {
      ...req.body,
      clientId: clientId || req.body.clientId || null
    };
    
    const transaction = await Transaction.create(transactionData);

    // Update client revenue if this is an income transaction with a client
    if (transaction.type === 'income' && transaction.clientId) {
      await Client.findByIdAndUpdate(
        transaction.clientId,
        {
          $inc: { revenue: transaction.amount },
          lastContact: new Date()
        }
      );
    }

    // Populate before sending response
    await transaction.populate('clientId', 'name company');
    await transaction.populate('bookingId', 'spaceName clientName date startTime endTime totalPrice');
    await transaction.populate('studentProgramId', 'name program university');
    await transaction.populate('projectId', 'title client type budget status');

    res.status(201).json({
      success: true,
      data: transaction
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve transaction
// @route   PUT /api/transactions/:id/approve
// @access  Private
exports.approveTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      {
        status: 'approved',
        approvedBy: req.user.id
      },
      {
        new: true,
        runValidators: true
      }
    ).populate('approvedBy', 'name email');

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    res.status(200).json({
      success: true,
      data: transaction
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update transaction
// @route   PUT /api/transactions/:id
// @access  Private
exports.updateTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    res.status(200).json({
      success: true,
      data: transaction
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete transaction
// @route   DELETE /api/transactions/:id
// @access  Private
exports.deleteTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    // If this was an income transaction with a client, subtract from client revenue
    if (transaction.type === 'income' && transaction.clientId) {
      await Client.findByIdAndUpdate(
        transaction.clientId,
        {
          $inc: { revenue: -transaction.amount },
          lastContact: new Date()
        }
      );
    }

    await Transaction.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Transaction deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

