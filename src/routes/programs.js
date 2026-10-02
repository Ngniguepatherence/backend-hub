const express = require('express');
const {
  getPrograms,
  getProgram,
  createProgram,
  updateProgram,
  deleteProgram
} = require('../controllers/programController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(getPrograms)
  .post(protect, createProgram);

router.route('/:id')
  .get(getProgram)
  .put(protect, updateProgram)
  .delete(protect, deleteProgram);

module.exports = router;
