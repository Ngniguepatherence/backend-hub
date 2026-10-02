const express = require('express');
const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  updateProjectStatus,
  addDeliverable,
  updateDeliverable,
  addNote,
  deleteProject
} = require('../controllers/projectController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getProjects)
  .post(createProject);

router.route('/:id')
  .get(getProject)
  .put(updateProject)
  .delete(deleteProject);

router.patch('/:id/status', updateProjectStatus);
router.post('/:id/deliverables', addDeliverable);
router.patch('/:id/deliverables/:deliverableIndex', updateDeliverable);
router.post('/:id/notes', addNote);

module.exports = router;

