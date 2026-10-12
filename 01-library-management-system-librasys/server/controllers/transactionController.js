const Transaction = require('../models/Transaction');
const Book = require('../models/Book');
const Member = require('../models/Member');
const { markOverdueTransactions } = require('../utils/overdueCheck');
// POST /api/transactions/issue
exports.issueBook = async (req, res) => {
  try {
    const { bookId, memberId, dueInDays } = req.body;

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    if (book.availableCopies < 1) {
      return res.status(400).json({ message: 'No available copies to issue' });
    }

    const member = await Member.findById(memberId);
    if (!member) return res.status(404).json({ message: 'Member not found' });

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + (dueInDays || 14));

    const transaction = await Transaction.create({
      book: bookId,
      member: memberId,
      dueDate,
    });

    book.availableCopies -= 1;
    await book.save();

    const populated = await transaction.populate(['book', 'member']);
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/transactions/return/:id
exports.returnBook = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
    if (transaction.status === 'returned') {
      return res.status(400).json({ message: 'Book already returned' });
    }

    transaction.returnDate = new Date();
    transaction.status = 'returned';
    await transaction.save();

    const book = await Book.findById(transaction.book);
    if (book) {
      book.availableCopies += 1;
      await book.save();
    }

    const populated = await transaction.populate(['book', 'member']);
    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/transactions
exports.getTransactions = async (req, res) => {
  try {
    await markOverdueTransactions();
    const transactions = await Transaction.find()
      .populate('book')
      .populate('member')
      .sort({ createdAt: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// GET /api/transactions/my
exports.getMyTransactions = async (req, res) => {
  try {
    if (!req.user.memberId) {
      return res.status(400).json({ message: 'This account is not linked to a member record' });
    }

    await markOverdueTransactions();

    const transactions = await Transaction.find({ member: req.user.memberId })
      .populate('book')
      .sort({ createdAt: -1 });

    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};