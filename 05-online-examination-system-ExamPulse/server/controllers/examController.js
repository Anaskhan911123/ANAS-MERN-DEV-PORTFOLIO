const Exam = require('../models/Exam');
const Question = require('../models/Question');
const Attempt = require('../models/Attempt');

async function createExam(req, res, next) {
  try {
    const { title, subject, durationMinutes, scheduledAt, questions } = req.body;

    const exam = await Exam.create({
      title,
      subject,
      durationMinutes,
      scheduledAt,
      createdBy: req.user._id,
    });

    const docs = questions.map((q) => ({ ...q, exam: exam._id }));
    await Question.insertMany(docs);

    res.status(201).json({ exam });
  } catch (err) {
    next(err);
  }
}

async function listExams(req, res, next) {
  try {
    const exams = await Exam.find().populate('questionCount').sort({ scheduledAt: 1 }).lean({ virtuals: true });
    const attempts = await Attempt.find({ student: req.user._id }).lean();
    const attemptByExam = new Map(attempts.map((a) => [String(a.exam), a]));

    const withStatus = exams.map((exam) => {
      const attempt = attemptByExam.get(String(exam._id));
      return {
        ...exam,
        attempt: attempt
          ? {
              id: attempt._id,
              status: attempt.status,
              score: attempt.score,
              totalMarks: attempt.totalMarks,
            }
          : null,
      };
    });

    res.json({ exams: withStatus });
  } catch (err) {
    next(err);
  }
}

async function getExamForAttempt(req, res, next) {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) return res.status(404).json({ message: "That exam doesn't exist." });

    const existing = await Attempt.findOne({ exam: exam._id, student: req.user._id });
    if (existing && existing.status === 'submitted') {
      return res.status(409).json({ message: "You've already submitted this exam." });
    }

    const questions = await Question.find({ exam: exam._id }).select('-correctOption');
    res.json({ exam, questions, attemptId: existing ? existing._id : null });
  } catch (err) {
    next(err);
  }
}

module.exports = { createExam, listExams, getExamForAttempt };