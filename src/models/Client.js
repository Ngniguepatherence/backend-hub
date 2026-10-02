const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a client name'],
    trim: true
  },
  company: {
    type: String,
    required: [true, 'Please provide a company name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: [true, 'Please provide a phone number'],
    trim: true
  },
  type: {
    type: String,
    enum: ['enterprise', 'startup', 'individual'],
    required: [true, 'Please provide a client type']
  },
  status: {
    type: String,
    enum: ['active', 'prospect', 'inactive'],
    default: 'prospect'
  },
  revenue: {
    type: Number,
    default: 0
  },
  lastContact: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Client', clientSchema);

