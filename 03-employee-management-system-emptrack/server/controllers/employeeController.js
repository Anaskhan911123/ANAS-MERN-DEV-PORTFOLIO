const Employee = require('../models/Employee');

const createEmployee = async (req, res) => {
  try {
    const employee = await Employee.create({ ...req.body, createdBy: req.user._id });
    const populated = await employee.populate('department', 'name color');
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/employees?search=&department=&status=&page=&limit=
const getEmployees = async (req, res) => {
  const { search = '', department, status, page = 1, limit = 10 } = req.query;
  const query = {};

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { position: { $regex: search, $options: 'i' } },
    ];
  }
  if (department) query.department = department;
  if (status) query.status = status;

  const skip = (Number(page) - 1) * Number(limit);
  const [employees, total] = await Promise.all([
    Employee.find(query).populate('department', 'name color').sort('-createdAt').skip(skip).limit(Number(limit)),
    Employee.countDocuments(query),
  ]);

  res.json({ employees, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
};

const getEmployee = async (req, res) => {
  const employee = await Employee.findById(req.params.id).populate('department', 'name color');
  if (!employee) return res.status(404).json({ message: 'Employee not found' });
  res.json(employee);
};

const updateEmployee = async (req, res) => {
  const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('department', 'name color');
  if (!employee) return res.status(404).json({ message: 'Employee not found' });
  res.json(employee);
};

// admin-only, enforced by route middleware
const deleteEmployee = async (req, res) => {
  const employee = await Employee.findByIdAndDelete(req.params.id);
  if (!employee) return res.status(404).json({ message: 'Employee not found' });
  res.json({ message: 'Employee deleted' });
};

module.exports = { createEmployee, getEmployees, getEmployee, updateEmployee, deleteEmployee };