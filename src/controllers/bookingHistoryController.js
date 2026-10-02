const BookingHistory = require('../models/BookingHistory');
const Booking = require('../models/Booking');
const Space = require('../models/Space');

// @desc    Get all booking history
// @route   GET /api/booking-history
// @access  Private
exports.getBookingHistory = async (req, res, next) => {
  try {
    const { startDate, endDate, spaceId, clientId } = req.query;
    
    const query = {};
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    if (spaceId) query.spaceId = spaceId;
    if (clientId) query.clientId = clientId;

    const history = await BookingHistory.find(query)
      .populate('spaceId', 'name type')
      .populate('clientId', 'name company')
      .sort({ date: -1, completedAt: -1 });
    
    res.status(200).json({
      success: true,
      count: history.length,
      data: history
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single booking history entry
// @route   GET /api/booking-history/:id
// @access  Private
exports.getBookingHistoryEntry = async (req, res, next) => {
  try {
    const history = await BookingHistory.findById(req.params.id)
      .populate('spaceId', 'name type capacity')
      .populate('clientId', 'name company email phone');

    if (!history) {
      return res.status(404).json({
        success: false,
        message: 'History entry not found'
      });
    }

    res.status(200).json({
      success: true,
      data: history
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Archive completed booking to history
// @route   POST /api/booking-history/archive
// @access  Private
exports.archiveBooking = async (req, res, next) => {
  try {
    const { bookingId, status = 'completed', notes } = req.body;
    
    const booking = await Booking.findById(bookingId)
      .populate('spaceId')
      .populate('clientId');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Create history entry
    const historyEntry = await BookingHistory.create({
      originalBookingId: booking._id,
      spaceId: booking.spaceId._id || booking.spaceId,
      spaceName: booking.spaceName,
      clientId: booking.clientId._id || booking.clientId,
      clientName: booking.clientName,
      date: booking.date,
      startTime: booking.startTime,
      endTime: booking.endTime,
      status,
      totalPrice: booking.totalPrice,
      notes
    });

    // Delete the original booking
    await Booking.findByIdAndDelete(bookingId);

    res.status(201).json({
      success: true,
      data: historyEntry
    });
  } catch (error) {
    next(error);
  }
};
