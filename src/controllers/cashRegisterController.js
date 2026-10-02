const CashRegister = require('../models/CashRegister');
const Transaction = require('../models/Transaction');

// @desc    Get current open cash register session or today's session
// @route   GET /api/cash-register/current
// @access  Private
exports.getCurrentSession = async (req, res, next) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    // First find any open session
    let session = await CashRegister.findOne({ status: 'open' })
      .populate('openedBy', 'name email')
      .sort({ createdAt: -1 });

    if (!session) {
      // Find today's closed session if exists
      session = await CashRegister.findOne({ date: today })
        .populate('openedBy', 'name email')
        .populate('closedBy', 'name email');
    }

    res.status(200).json({
      success: true,
      data: session
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all cash register history sessions
// @route   GET /api/cash-register/history
// @access  Private
exports.getSessionHistory = async (req, res, next) => {
  try {
    const sessions = await CashRegister.find()
      .populate('openedBy', 'name email')
      .populate('closedBy', 'name email')
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: sessions.length,
      data: sessions
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Open a new daily cash register session
// @route   POST /api/cash-register/open
// @access  Private
exports.openSession = async (req, res, next) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const { openingBalance, notes } = req.body;

    // Check if an open session already exists
    const existingOpen = await CashRegister.findOne({ status: 'open' });
    if (existingOpen) {
      return res.status(400).json({
        success: false,
        message: 'Une session de caisse est déjà ouverte. Veuillez la clôturer d\'abord.'
      });
    }

    const session = await CashRegister.create({
      date: today,
      openingTime: new Date(),
      status: 'open',
      openingBalance: openingBalance || 0,
      expectedBalance: openingBalance || 0,
      actualBalance: openingBalance || 0,
      openedBy: req.user ? req.user.id : null,
      openedByName: req.user ? req.user.name : 'Administrateur',
      notes
    });

    res.status(201).json({
      success: true,
      data: session
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Close cash register session
// @route   PUT /api/cash-register/:id/close
// @access  Private
exports.closeSession = async (req, res, next) => {
  try {
    const { actualBalance, cashDenominations, notes } = req.body;
    const session = await CashRegister.findById(req.params.id);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session de caisse non trouvée'
      });
    }

    if (session.status === 'closed') {
      return res.status(400).json({
        success: false,
        message: 'Cette session est déjà clôturée'
      });
    }

    // Calculate all cash transactions of this session/day
    const sessionStart = session.openingTime;
    const sessionEnd = new Date();

    const cashTransactions = await Transaction.find({
      paymentMethod: 'cash',
      createdAt: { $gte: sessionStart, $lte: sessionEnd }
    });

    const totalCashIn = cashTransactions
      .filter(t => t.type === 'income' || t.type === 'capital')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalCashOut = cashTransactions
      .filter(t => (t.type === 'expense' || t.type === 'investment') && t.status !== 'rejected')
      .reduce((sum, t) => sum + t.amount, 0);

    const expectedBalance = session.openingBalance + totalCashIn - totalCashOut;
    const countedBalance = actualBalance !== undefined ? actualBalance : expectedBalance;
    const difference = countedBalance - expectedBalance;

    session.status = 'closed';
    session.closingTime = sessionEnd;
    session.totalCashIn = totalCashIn;
    session.totalCashOut = totalCashOut;
    session.expectedBalance = expectedBalance;
    session.actualBalance = countedBalance;
    session.closingBalance = countedBalance;
    session.difference = difference;
    session.cashDenominations = cashDenominations || session.cashDenominations;
    session.closedBy = req.user ? req.user.id : null;
    session.closedByName = req.user ? req.user.name : 'Administrateur';
    if (notes) session.notes = (session.notes ? session.notes + '\n' : '') + notes;

    await session.save();

    res.status(200).json({
      success: true,
      data: session
    });
  } catch (error) {
    next(error);
  }
};
