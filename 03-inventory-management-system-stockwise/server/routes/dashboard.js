const express = require('express');
const router = express.Router();
const { getSummary, getStockOverview } = require('../controllers/dashboardController');

router.get('/summary', getSummary);
router.get('/stock-overview', getStockOverview);

module.exports = router;