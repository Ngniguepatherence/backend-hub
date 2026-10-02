const express = require('express');
const {
  getBookingHistory,
  getBookingHistoryEntry,
  archiveBooking
} = require('../controllers/bookingHistoryController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getBookingHistory);

router.route('/archive')
  .post(archiveBooking);

router.route('/:id')
  .get(getBookingHistoryEntry);

module.exports = router;
