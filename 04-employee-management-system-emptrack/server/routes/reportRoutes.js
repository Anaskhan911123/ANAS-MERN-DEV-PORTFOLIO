const express = require('express');
const router = express.Router();
const { getSummary } = require('../controllers/reportController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.get('/summary', getSummary);

module.exports = router;