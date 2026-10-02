const express = require('express');
const {
  calculatePerformance,
  getEmployeePerformance,
  getAllPerformances,
  recalculateAllPerformances
} = require('../controllers/performanceController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/recalculate')
  .post(recalculateAllPerformances);

router.route('/:employeeId')
  .get(getEmployeePerformance)
  .post(calculatePerformance);

router.route('/')
  .get(getAllPerformances);

module.exports = router;
