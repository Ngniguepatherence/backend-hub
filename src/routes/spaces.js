const express = require('express');
const {
  getSpaces,
  getSpace,
  createSpace,
  updateSpace,
  deleteSpace
} = require('../controllers/spaceController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(protect);

router.route('/')
  .get(getSpaces)
  .post(createSpace);

router.route('/:id')
  .get(getSpace)
  .put(updateSpace)
  .delete(deleteSpace);

module.exports = router;

