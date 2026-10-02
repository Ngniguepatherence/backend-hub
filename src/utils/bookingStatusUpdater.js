const Booking = require('../models/Booking');
const Space = require('../models/Space');
const BookingHistory = require('../models/BookingHistory');

/**
 * Check if a booking time has passed
 */
function isBookingExpired(booking) {
  const now = new Date();
  const bookingDate = new Date(booking.date);
  
  // Parse end time
  const [hours, minutes] = booking.endTime.split(':').map(Number);
  const bookingEnd = new Date(bookingDate);
  bookingEnd.setHours(hours, minutes, 0, 0);
  
  return now > bookingEnd;
}

/**
 * Update booking statuses and space availability automatically
 */
async function updateBookingStatuses() {
  try {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    // Get all confirmed bookings
    const confirmedBookings = await Booking.find({ status: 'confirmed' })
      .populate('spaceId')
      .populate('clientId');

    let updatedCount = 0;
    let archivedCount = 0;

    for (const booking of confirmedBookings) {
      // Skip if spaceId or clientId is null (data integrity issue)
      if (!booking.spaceId || !booking.clientId) {
        console.warn(`⚠️ Skipping booking ${booking._id}: missing spaceId or clientId`);
        continue;
      }

      const bookingDate = new Date(booking.date);
      const bookingDay = new Date(bookingDate.getFullYear(), bookingDate.getMonth(), bookingDate.getDate());
      
      // Get IDs safely
      const spaceId = booking.spaceId._id || booking.spaceId;
      const clientId = booking.clientId._id || booking.clientId;
      
      // Check if booking is in the past (yesterday or earlier)
      if (bookingDay < today) {
        // Archive to history
        await BookingHistory.create({
          originalBookingId: booking._id,
          spaceId: spaceId,
          spaceName: booking.spaceName || 'Unknown Space',
          clientId: clientId,
          clientName: booking.clientName || 'Unknown Client',
          date: booking.date,
          startTime: booking.startTime,
          endTime: booking.endTime,
          status: 'completed',
          totalPrice: booking.totalPrice || 0
        });

        // Update space to available
        await Space.findByIdAndUpdate(spaceId, {
          status: 'available',
          $unset: { currentBooking: 1 }
        });

        // Delete the booking
        await Booking.findByIdAndDelete(booking._id);
        archivedCount++;
      } else if (bookingDay.getTime() === today.getTime()) {
        // Same day - check if end time has passed
        if (isBookingExpired(booking)) {
          // Archive to history
          await BookingHistory.create({
            originalBookingId: booking._id,
            spaceId: spaceId,
            spaceName: booking.spaceName || 'Unknown Space',
            clientId: clientId,
            clientName: booking.clientName || 'Unknown Client',
            date: booking.date,
            startTime: booking.startTime,
            endTime: booking.endTime,
            status: 'completed',
            totalPrice: booking.totalPrice || 0
          });

          // Update space to available
          await Space.findByIdAndUpdate(spaceId, {
            status: 'available',
            $unset: { currentBooking: 1 }
          });

          // Delete the booking
          await Booking.findByIdAndDelete(booking._id);
          archivedCount++;
        }
      }
    }

    // Also check spaces with currentBooking that might be expired
    const spacesWithBookings = await Space.find({ 
      status: { $in: ['occupied', 'reserved'] },
      currentBooking: { $exists: true, $ne: null }
    });

    for (const space of spacesWithBookings) {
      if (!space.currentBooking || !space.currentBooking.date) continue;
      
      const bookingDate = new Date(space.currentBooking.date);
      const bookingDay = new Date(bookingDate.getFullYear(), bookingDate.getMonth(), bookingDate.getDate());
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      if (bookingDay < today) {
        // Past booking, make space available
        await Space.findByIdAndUpdate(space._id, {
          status: 'available',
          $unset: { currentBooking: 1 }
        });
        updatedCount++;
      } else if (bookingDay.getTime() === today.getTime() && space.currentBooking.until) {
        // Same day - check if end time has passed
        const [hours, minutes] = space.currentBooking.until.split(':').map(Number);
        const endTime = new Date(bookingDate);
        endTime.setHours(hours, minutes, 0, 0);
        
        if (now > endTime) {
          await Space.findByIdAndUpdate(space._id, {
            status: 'available',
            $unset: { currentBooking: 1 }
          });
          updatedCount++;
        }
      }
    }

    console.log(`✅ Booking status update: ${archivedCount} bookings archived, ${updatedCount} spaces updated`);
    return { archivedCount, updatedCount };
  } catch (error) {
    console.error('❌ Error updating booking statuses:', error);
    throw error;
  }
}

module.exports = {
  updateBookingStatuses,
  isBookingExpired
};
