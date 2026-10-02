const Booking = require('../models/Booking');
const Space = require('../models/Space');
const Client = require('../models/Client');
const BookingHistory = require('../models/BookingHistory');
const { updateBookingStatuses } = require('../utils/bookingStatusUpdater');

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private
exports.getBookings = async (req, res, next) => {
  try {
    // Auto-update booking statuses before fetching
    await updateBookingStatuses();
    
    const bookings = await Booking.find()
      .populate('spaceId', 'name type')
      .populate('clientId', 'name company')
      .sort({ date: -1 });
    
    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
exports.getBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('spaceId', 'name type capacity')
      .populate('clientId', 'name company email phone');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
exports.createBooking = async (req, res, next) => {
  try {
    const space = await Space.findById(req.body.spaceId);
    if (!space) {
      return res.status(404).json({
        success: false,
        message: 'Espace non trouvé'
      });
    }

    let clientName = req.body.clientName || 'Client Coworking';
    let clientId = null;

    if (req.body.clientId && req.body.clientId !== 'client-quick' && req.body.clientId !== 'null') {
      const client = await Client.findById(req.body.clientId);
      if (client) {
        clientName = client.name;
        clientId = client._id;
      }
    }

    req.body.clientName = clientName;
    req.body.clientId = clientId;

    // Check for time slot conflicts (only strict for private offices/meeting rooms)
    const { date, startTime, endTime } = req.body;
    const isCoworkingOpenSpace = space.type === 'coworking';

    const conflicts = space.timeSlotBookings.filter(slot => {
      if (slot.date !== date) return false;
      if (slot.status === 'cancelled') return false;
      
      const existingStart = parseInt(slot.startTime.split(':')[0]);
      const existingEnd = parseInt(slot.endTime.split(':')[0]);
      const newStart = parseInt(startTime.split(':')[0]);
      const newEnd = parseInt(endTime.split(':')[0]);
      
      return !(newEnd <= existingStart || newStart >= existingEnd);
    });

    if (!isCoworkingOpenSpace && conflicts.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Conflit de créneau : Cet espace est déjà réservé pour cet horaire'
      });
    } else if (isCoworkingOpenSpace && conflicts.length >= (space.capacity || 20)) {
      return res.status(409).json({
        success: false,
        message: `Capacité maximale atteinte : L'espace Coworking est complet (${space.capacity} places) sur ce créneau`
      });
    }

    // Add space and client names
    req.body.spaceName = space.name;
    req.body.clientName = client.name;

    const booking = await Booking.create(req.body);

    // Update space with time slot booking
    if (booking.status === 'confirmed') {
      const newTimeSlot = {
        date: booking.date,
        startTime: booking.startTime,
        endTime: booking.endTime,
        client: client.name,
        clientId: client._id,
        bookingId: booking._id,
        status: 'confirmed'
      };

      await Space.findByIdAndUpdate(space._id, {
        $push: { timeSlotBookings: newTimeSlot }
      });

      // Check if all time slots for today are booked (09-18 hours = full day)
      const updatedSpace = await Space.findById(space._id);
      const dayBookings = updatedSpace.timeSlotBookings.filter(
        slot => slot.date === date && slot.status === 'confirmed'
      );
      
      // Mark as occupied only if full day is booked (9-18 = 9 hours)
      const totalHours = dayBookings.reduce((sum, slot) => {
        const start = parseInt(slot.startTime.split(':')[0]);
        const end = parseInt(slot.endTime.split(':')[0]);
        return sum + (end - start);
      }, 0);

      if (totalHours >= 9) {
        await Space.findByIdAndUpdate(space._id, { status: 'occupied' });
      } else {
        await Space.findByIdAndUpdate(space._id, { status: 'reserved' });
      }
    }

    res.status(201).json({
      success: true,
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update booking
// @route   PUT /api/bookings/:id
// @access  Private
exports.updateBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate('spaceId').populate('clientId');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Update space status based on booking status
    if (req.body.status) {
      if (req.body.status === 'cancelled') {
        // Remove from time slot bookings
        await Space.findByIdAndUpdate(booking.spaceId._id, {
          $pull: { timeSlotBookings: { bookingId: booking._id } }
        });
        
        // Recalculate space status
        const updatedSpace = await Space.findById(booking.spaceId._id);
        if (updatedSpace.timeSlotBookings.length === 0) {
          await Space.findByIdAndUpdate(booking.spaceId._id, { status: 'available' });
        } else {
          await Space.findByIdAndUpdate(booking.spaceId._id, { status: 'reserved' });
        }
      } else if (req.body.status === 'confirmed') {
        const clientId = booking.clientId._id || booking.clientId;
        const clientName = booking.clientId.name || booking.clientName;
        
        // Add to time slot bookings if not already there
        const exists = updatedSpace.timeSlotBookings.some(slot => slot.bookingId?.toString() === booking._id.toString());
        if (!exists) {
          await Space.findByIdAndUpdate(booking.spaceId._id, {
            $push: {
              timeSlotBookings: {
                date: booking.date,
                startTime: booking.startTime,
                endTime: booking.endTime,
                client: clientName,
                clientId: clientId,
                bookingId: booking._id,
                status: 'confirmed'
              }
            }
          });
        }
        
        // Recalculate space status
        const updatedSpace = await Space.findById(booking.spaceId._id);
        const dayBookings = updatedSpace.timeSlotBookings.filter(
          slot => slot.date === booking.date && slot.status === 'confirmed'
        );
        
        const totalHours = dayBookings.reduce((sum, slot) => {
          const start = parseInt(slot.startTime.split(':')[0]);
          const end = parseInt(slot.endTime.split(':')[0]);
          return sum + (end - start);
        }, 0);

        if (totalHours >= 9) {
          await Space.findByIdAndUpdate(booking.spaceId._id, { status: 'occupied' });
        } else {
          await Space.findByIdAndUpdate(booking.spaceId._id, { status: 'reserved' });
        }
      }
    }

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel/Delete booking
// @route   DELETE /api/bookings/:id
// @access  Private
exports.cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Remove from space time slot bookings
    await Space.findByIdAndUpdate(booking.spaceId, {
      $pull: { timeSlotBookings: { bookingId: booking._id } }
    });

    // Recalculate space status
    const updatedSpace = await Space.findById(booking.spaceId);
    if (updatedSpace.timeSlotBookings.length === 0) {
      await Space.findByIdAndUpdate(booking.spaceId, { status: 'available' });
    } else {
      await Space.findByIdAndUpdate(booking.spaceId, { status: 'reserved' });
    }

    await Booking.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully'
    });
  } catch (error) {
    next(error);
  }
};

