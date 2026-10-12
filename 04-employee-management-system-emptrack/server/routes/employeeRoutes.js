const express = require('express');
const router = express.Router();
const { createEmployee, getEmployees, getEmployee, updateEmployee, deleteEmployee } = require('../controllers/employeeController');
const { protect, adminOnly } = require('../middleware/auth');

router.use(protect);
router.route('/').get(getEmployees).post(createEmployee);
router.route('/:id').get(getEmployee).patch(updateEmployee).delete(adminOnly, deleteEmployee);

module.exports = router;