const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: [true, 'Please provide a phone number'],
    trim: true
  },
  position: {
    type: String,
    required: [true, 'Please provide a position'],
    trim: true
  },
  department: {
    type: String,
    required: [true, 'Please provide a department'],
    trim: true
  },
  salary: {
    type: Number,
    required: [true, 'Please provide a salary'],
    min: 0
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
    default: null
  },
  joinDate: {
    type: Date,
    required: [true, 'Please provide a join date'],
    default: Date.now
  },
  status: {
    type: String,
    enum: ['active', 'on_leave', 'inactive'],
    default: 'active'
  },
  performance: {
    type: String,
    enum: ['excellent', 'good', 'average', 'needs_improvement'],
    default: 'average'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Employee', employeeSchema);

