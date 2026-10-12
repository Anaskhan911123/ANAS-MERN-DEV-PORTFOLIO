const express = require('express');
const { body } = require('express-validator');
const { createExam, listExams, getExamForAttempt } = require('../controllers/examController');
const { protect, requireRole } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

router.get('/', protect, listExams);
router.get('/:id/attempt-view', protect, getExamForAttempt);

router.post(
  '/',
  protect,
  requireRole('instructor'),
  [
    body('title').trim().notEmpty().withMessage('Exam title is required.'),
    body('subject').trim().notEmpty().withMessage('Subject is required.'),
    body('durationMinutes').isInt({ min: 1 }).withMessage('Duration must be at least 1 minute.'),
    body('scheduledAt').isISO8601().withMessage('Scheduled date/time is invalid.'),
    body('questions').isArray({ min: 1 }).withMessage('Add at least one question.'),
  ],
  validate,
  createExam
);

module.exports = router;