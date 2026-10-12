const express = require('express');
const router = express.Router();
const {
  receiveStock,
  fulfillOrder,
  adjustStock,
  getActivity,
} = require('../controllers/stockController');

router.post('/receive', receiveStock);
router.post('/fulfill', fulfillOrder);
router.post('/adjust', adjustStock);
router.get('/activity', getActivity);

module.exports = router;