const express = require('express');
const router = express.Router();
const { getUnitsMovement, getTopCategory } = require('../controllers/reportController');

router.get('/units-movement', getUnitsMovement);
router.get('/top-category', getTopCategory);

module.exports = router;