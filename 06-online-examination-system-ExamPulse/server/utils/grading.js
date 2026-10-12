function gradeAttempt(questions, submittedAnswers) {
  const submittedMap = new Map(
    submittedAnswers.map((a) => [String(a.questionId), a.selectedOption || null])
  );

  const answers = [];
  const topicTally = new Map();
  let score = 0;
  let totalMarks = 0;
  let correctCount = 0;
  let incorrectCount = 0;
  let skippedCount = 0;

  for (const q of questions) {
    const selected = submittedMap.get(String(q._id)) ?? null;
    const isCorrect = selected !== null && selected === q.correctOption;

    totalMarks += q.marks;
    if (isCorrect) {
      score += q.marks;
      correctCount += 1;
    } else if (selected === null) {
      skippedCount += 1;
    } else {
      incorrectCount += 1;
    }

    const t = topicTally.get(q.topic) || { correct: 0, total: 0 };
    t.total += 1;
    if (isCorrect) t.correct += 1;
    topicTally.set(q.topic, t);

    answers.push({ question: q._id, selectedOption: selected, isCorrect });
  }

  const topicBreakdown = Array.from(topicTally.entries()).map(([topic, t]) => ({
    topic,
    correct: t.correct,
    total: t.total,
  }));

  return { answers, score, totalMarks, correctCount, incorrectCount, skippedCount, topicBreakdown };
}

module.exports = { gradeAttempt };