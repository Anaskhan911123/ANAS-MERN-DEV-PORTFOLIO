const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema(
  {
    key: { type: String, required: true },
    text: { type: String, required: true },
  },
  { _id: false }
);

const questionSchema = new mongoose.Schema({
  exam: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
  text: { type: String, required: true },
  options: {
    type: [optionSchema],
    validate: (v) => Array.isArray(v) && v.length >= 2,
  },
  correctOption: { type: String, required: true },
  topic: { type: String, required: true, trim: true },
  marks: { type: Number, default: 1 },
});

module.exports = mongoose.model('Question', questionSchema);