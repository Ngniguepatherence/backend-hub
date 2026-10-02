const mongoose = require('mongoose');

const timeSlotSchema = new mongoose.Schema({
  date: {
    type: String, // Date string like "2024-12-25"
    required: true
  },
  startTime: {
    type: String, // Time string like "09:00"
    required: true
  },
  endTime: {
    type: String, // Time string like "12:00"
    required: true
  },
  client: String,
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client'
  },
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking'
  },
  status: {
    type: String,
    enum: ['confirmed', 'pending', 'cancelled'],
    default: 'confirmed'
  }
}, { _id: false });

const spaceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a space name'],
    trim: true
  },
  type: {
    type: String,
    enum: ['office', 'conference', 'coworking', 'studio', 'meeting', 'event_hall', 'private_office', 'coworking_desk'],
    required: [true, 'Please provide a space type']
  },
  capacity: {
    type: Number,
    required: [true, 'Please provide capacity'],
    min: 1
  },
  pricePerHour: {
    type: Number,
    required: [true, 'Please provide price per hour'],
    min: 0
  },
  pricePerDay: {
    type: Number,
    default: 0
  },
  pricePerMonth: {
    type: Number,
    default: 0
  },
  amenities: [{
    type: String
  }],
  status: {
    type: String,
    enum: ['available', 'occupied', 'reserved', 'maintenance'],
    default: 'available'
  },
  description: {
    type: String
  },
  location: {
    type: String,
    default: 'Étage 1'
  },
  timeSlotBookings: [timeSlotSchema],
  currentBooking: {
    client: String,
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client'
    },
    until: String,
    date: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Space', spaceSchema);
