const express = require('express');
const router = express.Router();
const {
  getCurrentSession,
  getSessionHistory,
  openSession,
  closeSession
} = require('../controllers/cashRegisterController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/current', getCurrentSession);
router.get('/history', getSessionHistory);
router.post('/open', openSession);
router.put('/:id/close', closeSession);

module.exports = router;
