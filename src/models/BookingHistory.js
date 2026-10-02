const mongoose = require('mongoose');

const bookingHistorySchema = new mongoose.Schema({
  originalBookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  spaceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Space',
    required: true
  },
  spaceName: {
    type: String,
    required: true
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
  clientName: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['completed', 'cancelled', 'no_show'],
    default: 'completed'
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  completedAt: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
bookingHistorySchema.index({ date: -1 });
bookingHistorySchema.index({ spaceId: 1, date: -1 });
bookingHistorySchema.index({ clientId: 1, date: -1 });

module.exports = mongoose.model('BookingHistory', bookingHistorySchema);
