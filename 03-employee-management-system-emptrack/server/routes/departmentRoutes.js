const express = require('express');
const router = express.Router();
const { createDepartment, getDepartments, updateDepartment, deleteDepartment } = require('../controllers/departmentController');
const { protect, adminOnly } = require('../middleware/auth');

router.use(protect);
router.route('/').get(getDepartments).post(adminOnly, createDepartment);
router.route('/:id').patch(adminOnly, updateDepartment).delete(adminOnly, deleteDepartment);

module.exports = router;