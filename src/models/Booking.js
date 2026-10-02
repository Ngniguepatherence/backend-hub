const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  spaceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Space',
    required: [true, 'Please provide a space ID']
  },
  spaceName: {
    type: String,
    required: true
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: false,
    default: null
  },
  clientName: {
    type: String,
    required: true
  },
  clientPhone: {
    type: String,
    trim: true,
    default: null
  },
  clientEmail: {
    type: String,
    trim: true,
    default: null
  },
  deskNumber: {
    type: String,
    trim: true,
    default: null
  },
  date: {
    type: Date,
    required: [true, 'Please provide a booking date']
  },
  startTime: {
    type: String,
    required: [true, 'Please provide start time']
  },
  endTime: {
    type: String,
    required: [true, 'Please provide end time']
  },
  status: {
    type: String,
    enum: ['confirmed', 'pending', 'cancelled', 'completed'],
    default: 'confirmed'
  },
  bookingType: {
    type: String,
    enum: ['hourly', 'half_day', 'daily', 'weekly', 'monthly', 'event', 'subscription', 'drop_in'],
    default: 'daily'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'partially_paid', 'refunded'],
    default: 'paid'
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'bank_transfer', 'mobile_money', 'card', 'check'],
    default: 'cash'
  },
  checkInStatus: {
    type: String,
    enum: ['not_checked_in', 'checked_in', 'checked_out'],
    default: 'not_checked_in'
  },
  checkInTime: {
    type: Date
  },
  checkOutTime: {
    type: Date
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  paidAmount: {
    type: Number,
    default: 0
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Booking', bookingSchema);
