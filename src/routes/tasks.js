const express = require('express');
const {
  getTasks,
  getTask,
  getMyTasks,
  createTask,
  updateTask,
  deleteTask,
  addComment
} = require('../controllers/taskController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

// Must come before '/:id' route
router.get('/me/assigned', getMyTasks);

router.route('/')
  .get(getTasks)
  .post(createTask);

router.route('/:id')
  .get(getTask)
  .put(updateTask)
  .delete(deleteTask);

router.route('/:id/comments')
  .post(addComment);

module.exports = router;

