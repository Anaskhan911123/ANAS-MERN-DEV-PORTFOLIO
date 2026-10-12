const Transaction = require('../models/Transaction');

// Marks any 'issued' transaction past its dueDate as 'overdue'
exports.markOverdueTransactions = async () => {
  await Transaction.updateMany(
    { status: 'issued', dueDate: { $lt: new Date() } },
    { $set: { status: 'overdue' } }
  );
};