const express = require('express');
const { body } = require('express-validator');
const {
  startAttempt,
  submitAttempt,
  getAttempt,
  getOverview,
} = require('../controllers/attemptController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

router.get('/overview', protect, getOverview);
router.post('/:examId/start', protect, startAttempt);
router.get('/:attemptId', protect, getAttempt);

router.post(
  '/:attemptId/submit',
  protect,
  [body('answers').isArray().withMessage('Answers must be a list.')],
  validate,
  submitAttempt
);

module.exports = router;