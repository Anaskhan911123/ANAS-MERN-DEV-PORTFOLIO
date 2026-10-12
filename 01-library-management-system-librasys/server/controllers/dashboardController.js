const Book = require('../models/Book');
const Member = require('../models/Member');
const Transaction = require('../models/Transaction');
const { markOverdueTransactions } = require('../utils/overdueCheck');

// GET /api/dashboard/stats
exports.getStats = async (req, res) => {
  try {
    await markOverdueTransactions();

    const [totalBooks, totalMembers, issuedCount, overdueCount, recentlyIssued] = await Promise.all([
      Book.countDocuments(),
      Member.countDocuments(),
      Transaction.countDocuments({ status: 'issued' }),
      Transaction.countDocuments({ status: 'overdue' }),
      Transaction.find({ status: { $in: ['issued', 'overdue'] } })
        .populate('book')
        .populate('member')
        .sort({ issueDate: -1 })
        .limit(5),
    ]);

    res.json({
      totalBooks,
      totalMembers,
      issuedCount,
      overdueCount,
      recentlyIssued,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};