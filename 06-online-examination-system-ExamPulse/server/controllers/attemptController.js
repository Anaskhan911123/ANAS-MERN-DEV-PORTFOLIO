const Exam = require('../models/Exam');
const Question = require('../models/Question');
const Attempt = require('../models/Attempt');
const { gradeAttempt } = require('../utils/grading');

async function startAttempt(req, res, next) {
  try {
    const exam = await Exam.findById(req.params.examId);
    if (!exam) return res.status(404).json({ message: "That exam doesn't exist." });

    let attempt = await Attempt.findOne({ exam: exam._id, student: req.user._id });
    if (attempt && attempt.status === 'submitted') {
      return res.status(409).json({ message: "You've already submitted this exam." });
    }
    if (!attempt) {
      attempt = await Attempt.create({ exam: exam._id, student: req.user._id });
    }

    res.status(201).json({
      attemptId: attempt._id,
      startedAt: attempt.startedAt,
      durationMinutes: exam.durationMinutes,
    });
  } catch (err) {
    next(err);
  }
}

async function submitAttempt(req, res, next) {
  try {
    const attempt = await Attempt.findById(req.params.attemptId);
    if (!attempt) return res.status(404).json({ message: "That attempt doesn't exist." });
    if (String(attempt.student) !== String(req.user._id)) {
      return res.status(403).json({ message: "That isn't your exam attempt." });
    }
    if (attempt.status === 'submitted') {
      return res.status(409).json({ message: "You've already submitted this exam." });
    }

    const questions = await Question.find({ exam: attempt.exam });
    const graded = gradeAttempt(questions, req.body.answers || []);

    Object.assign(attempt, graded, { status: 'submitted', submittedAt: new Date() });
    await attempt.save();

    res.json({ attempt });
  } catch (err) {
    next(err);
  }
}

async function getAttempt(req, res, next) {
  try {
    const attempt = await Attempt.findById(req.params.attemptId).populate('exam');
    if (!attempt) return res.status(404).json({ message: "That attempt doesn't exist." });
    if (String(attempt.student) !== String(req.user._id)) {
      return res.status(403).json({ message: "That isn't your result to view." });
    }

    const questions = await Question.find({ exam: attempt.exam._id });
    const byId = new Map(questions.map((q) => [String(q._id), q]));

    const review = attempt.answers.map((a) => {
      const q = byId.get(String(a.question));
      return {
        question: q.text,
        topic: q.topic,
        options: q.options,
        correctOption: q.correctOption,
        selectedOption: a.selectedOption,
        isCorrect: a.isCorrect,
      };
    });

    res.json({ attempt, review });
  } catch (err) {
    next(err);
  }
}

async function getOverview(req, res, next) {
  try {
    const upcomingCount = await Exam.countDocuments({ scheduledAt: { $gte: new Date() } });
    const submitted = await Attempt.find({ student: req.user._id, status: 'submitted' });

    const gradedCount = submitted.length;
    const averageScore = gradedCount
      ? Math.round(
          (submitted.reduce((sum, a) => sum + a.score / (a.totalMarks || 1), 0) / gradedCount) * 100
        )
      : 0;

    res.json({ upcomingCount, gradedCount, averageScore });
  } catch (err) {
    next(err);
  }
}

module.exports = { startAttempt, submitAttempt, getAttempt, getOverview };