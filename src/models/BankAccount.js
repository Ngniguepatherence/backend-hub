const mongoose = require('mongoose');

const bankAccountSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Nom du compte requis'],
    trim: true,
  },
  bankName: {
    type: String,
    required: [true, 'Nom de la banque ou opérateur requis'],
    trim: true,
  },
  accountNumber: {
    type: String,
    required: [true, 'Numéro de compte requis'],
    trim: true,
  },
  balance: {
    type: Number,
    default: 0,
    min: [0, 'Le solde ne peut pas être négatif'],
  },
  type: {
    type: String,
    enum: ['checking', 'savings', 'mobile_money', 'reserve'],
    default: 'checking',
  },
  currency: {
    type: String,
    default: 'XAF',
  },
  badgeColor: {
    type: String,
    default: 'bg-primary/20 text-primary border-primary/30',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('BankAccount', bankAccountSchema);
