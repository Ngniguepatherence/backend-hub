const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
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
  program: {
    type: String,
    required: [true, 'Please provide a program name'],
    trim: true
  },
  university: {
    type: String,
    required: false,
    trim: true
  },
  parentName: {
    type: String,
    trim: true
  },
  age: {
    type: Number,
    min: 0
  },
  startDate: {
    type: Date,
    required: [true, 'Please provide a start date']
  },
  endDate: {
    type: Date,
    required: [true, 'Please provide an end date']
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'pending'],
    default: 'pending'
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  type: {
    type: String,
    enum: ['student', 'intern', 'holiday_camp'],
    default: 'student'
  },
  fee: {
    type: Number,
    default: 0
  },
  mentor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: [true, 'Please provide a mentor']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Student', studentSchema);

