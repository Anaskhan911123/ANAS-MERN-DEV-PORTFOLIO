const express = require('express');
const router = express.Router();
const {
  issueBook,
  returnBook,
  getTransactions,
  getMyTransactions,
} = require('../controllers/transactionController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', protect, adminOnly, getTransactions);
router.get('/my', protect, getMyTransactions);
router.post('/issue', protect, adminOnly, issueBook);
router.put('/return/:id', protect, adminOnly, returnBook);

module.exports = router;