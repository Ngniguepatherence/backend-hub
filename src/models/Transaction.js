const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    trim: true
  },
  type: {
    type: String,
    enum: ['income', 'expense', 'investment', 'capital', 'transfer'],
    required: [true, 'Please provide a transaction type']
  },
  category: {
    type: String,
    required: [true, 'Please provide a category'],
    trim: true
  },
  analyticalCenter: {
    type: String,
    enum: ['coworking', 'formations_academie', 'media_production', 'evenements_locations', 'frais_generaux'],
    default: 'coworking'
  },
  passType: {
    type: String,
    enum: ['hourly', 'half_day', 'day_pass', 'week_pass', 'month_nomad', 'month_dedicated', 'student_pass', 'drop_in', 'other'],
    default: null
  },
  amount: {
    type: Number,
    required: [true, 'Please provide an amount'],
    min: 0
  },
  date: {
    type: Date,
    required: [true, 'Please provide a date'],
    default: Date.now
  },
  status: {
    type: String,
    enum: ['completed', 'pending', 'approved', 'rejected'],
    default: 'completed'
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'bank_transfer', 'mobile_money', 'check', 'card', 'other'],
    default: 'cash'
  },
  accountType: {
    type: String,
    enum: ['cash_register', 'bank_account', 'mobile_money', 'reserve'],
    default: 'cash_register'
  },
  accountName: {
    type: String,
    default: 'Caisse Principale (Espèces)'
  },
  reference: {
    type: String,
    trim: true
  },
  receiptNumber: {
    type: String,
    trim: true
  },
  payerOrBeneficiary: {
    type: String,
    trim: true
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    default: null
  },
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'HubService',
    default: null
  },
  studentProgramId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    default: null
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    default: null
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    default: null
  },
  cashRegisterSessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CashRegister',
    default: null
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Transaction', transactionSchema);
