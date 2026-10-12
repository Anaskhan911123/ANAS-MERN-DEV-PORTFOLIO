require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');
const Exam = require('./models/Exam');
const Question = require('./models/Question');
const Attempt = require('./models/Attempt');

async function seed() {
  await connectDB();

  await Promise.all([
    User.deleteMany({ rollNumber: { $in: ['INS-001', '2021-SE-045'] } }),
  ]);

  const instructor = await User.create({
    name: 'Sir Ahmed',
    rollNumber: 'INS-001',
    email: 'ahmed@exampulse.test',
    password: 'test1234',
    role: 'instructor',
  });

  const student = await User.create({
    name: 'Anas Khan',
    rollNumber: '2021-SE-045',
    email: 'anas@exampulse.test',
    password: 'test1234',
    role: 'student',
  });

  const exam = await Exam.create({
    title: 'Data Structures Midterm',
    subject: 'Data Structures',
    durationMinutes: 20,
    scheduledAt: new Date(),
    createdBy: instructor._id,
    status: 'active',
  });

  await Question.insertMany([
    {
      exam: exam._id,
      text: 'Which data structure uses FIFO ordering?',
      options: [
        { key: 'A', text: 'Stack' },
        { key: 'B', text: 'Queue' },
        { key: 'C', text: 'Tree' },
        { key: 'D', text: 'Graph' },
      ],
      correctOption: 'B',
      topic: 'Data structures',
      marks: 1,
    },
    {
      exam: exam._id,
      text: 'What is the time complexity of binary search?',
      options: [
        { key: 'A', text: 'O(n)' },
        { key: 'B', text: 'O(n^2)' },
        { key: 'C', text: 'O(log n)' },
        { key: 'D', text: 'O(1)' },
      ],
      correctOption: 'C',
      topic: 'Algorithms',
      marks: 1,
    },
    {
      exam: exam._id,
      text: 'Which traversal visits the root node first?',
      options: [
        { key: 'A', text: 'In-order' },
        { key: 'B', text: 'Post-order' },
        { key: 'C', text: 'Pre-order' },
        { key: 'D', text: 'Level-order' },
      ],
      correctOption: 'C',
      topic: 'Data structures',
      marks: 1,
    },
  ]);

  console.log('Seeded successfully:');
  console.log(`  Instructor: rollNumber=INS-001  password=test1234`);
  console.log(`  Student:    rollNumber=2021-SE-045  password=test1234`);
  console.log(`  Exam: "${exam.title}" (${exam._id})`);

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});