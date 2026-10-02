const BankAccount = require('../models/BankAccount');

// @desc    Get all bank accounts
// @route   GET /api/bank-accounts
exports.getBankAccounts = async (req, res, next) => {
  try {
    let accounts = await BankAccount.find({ isActive: true }).sort({ createdAt: -1 });
    
    // If no accounts exist yet in DB, seed defaults
    if (accounts.length === 0) {
      accounts = await BankAccount.insertMany([
        {
          name: 'Compte Courant Principal',
          bankName: 'BICEC Cameroun',
          accountNumber: 'CM21 10001 06815 98765432101 45',
          balance: 4850000,
          type: 'checking',
          currency: 'XAF',
          badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30'
        },
        {
          name: 'Compte Épargne & Trésorerie',
          bankName: 'Afriland First Bank',
          accountNumber: 'CM21 10005 02144 12345678901 88',
          balance: 2500000,
          type: 'savings',
          currency: 'XAF',
          badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
        },
        {
          name: 'Compte Marchand MTN MoMo',
          bankName: 'MTN Mobile Money',
          accountNumber: '+237 677 889 900',
          balance: 875000,
          type: 'mobile_money',
          currency: 'XAF',
          badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30'
        },
        {
          name: 'Compte Marchand Orange Money',
          bankName: 'Orange Money CM',
          accountNumber: '+237 699 112 233',
          balance: 620000,
          type: 'mobile_money',
          currency: 'XAF',
          badgeColor: 'bg-orange-500/20 text-orange-400 border-orange-500/30'
        }
      ]);
    }

    res.status(200).json({
      success: true,
      count: accounts.length,
      data: accounts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new bank account
// @route   POST /api/bank-accounts
exports.createBankAccount = async (req, res, next) => {
  try {
    const account = await BankAccount.create(req.body);
    res.status(201).json({
      success: true,
      data: account,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update bank account
// @route   PUT /api/bank-accounts/:id
exports.updateBankAccount = async (req, res, next) => {
  try {
    const account = await BankAccount.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!account) {
      return res.status(404).json({ success: false, message: 'Compte non trouvé' });
    }

    res.status(200).json({
      success: true,
      data: account,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete (soft delete) bank account
// @route   DELETE /api/bank-accounts/:id
exports.deleteBankAccount = async (req, res, next) => {
  try {
    const account = await BankAccount.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!account) {
      return res.status(404).json({ success: false, message: 'Compte non trouvé' });
    }

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};
