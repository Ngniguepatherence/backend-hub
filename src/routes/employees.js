const express = require('express');
const {
  getEmployees,
  getEmployee,
  createEmployee,
  createEmployeeWithUser,
  updateEmployee,
  deleteEmployee,
  syncEmployeeUserId
} = require('../controllers/employeeController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

// Must come before '/:id' route
router.post('/create-with-user', createEmployeeWithUser);

// Sync endpoint
router.post('/sync/userid', syncEmployeeUserId);

router.route('/')
  .get(getEmployees)
  .post(createEmployee);

router.route('/:id')
  .get(getEmployee)
  .put(updateEmployee)
  .delete(deleteEmployee);

module.exports = router;

