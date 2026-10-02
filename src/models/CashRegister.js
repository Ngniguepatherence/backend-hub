const mongoose = require('mongoose');

const cashRegisterSchema = new mongoose.Schema({
  date: {
    type: String, // YYYY-MM-DD
    required: true,
    unique: true
  },
  openingTime: {
    type: Date,
    default: Date.now
  },
  closingTime: {
    type: Date
  },
  status: {
    type: String,
    enum: ['open', 'closed'],
    default: 'open'
  },
  openingBalance: {
    type: Number,
    required: true,
    default: 0
  },
  closingBalance: {
    type: Number,
    default: 0
  },
  totalCashIn: {
    type: Number,
    default: 0
  },
  totalCashOut: {
    type: Number,
    default: 0
  },
  expectedBalance: {
    type: Number,
    default: 0
  },
  actualBalance: {
    type: Number,
    default: 0
  },
  difference: {
    type: Number,
    default: 0
  },
  openedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  openedByName: {
    type: String,
    default: 'Administrateur'
  },
  closedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  closedByName: {
    type: String
  },
  cashDenominations: {
    bills10000: { type: Number, default: 0 },
    bills5000: { type: Number, default: 0 },
    bills2000: { type: Number, default: 0 },
    bills1000: { type: Number, default: 0 },
    bills500: { type: Number, default: 0 },
    coins500: { type: Number, default: 0 },
    coins100: { type: Number, default: 0 },
    coins50: { type: Number, default: 0 },
    coins25: { type: Number, default: 0 }
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('CashRegister', cashRegisterSchema);
