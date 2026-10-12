const Department = require('../models/Department');
const Employee = require('../models/Employee');

const createDepartment = async (req, res) => {
  try {
    const { name, description, color } = req.body;
    const dept = await Department.create({ name, description, color });
    res.status(201).json(dept);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getDepartments = async (req, res) => {
  const departments = await Department.find().sort('name');
  const counts = await Employee.aggregate([{ $group: { _id: '$department', count: { $sum: 1 } } }]);
  const countMap = Object.fromEntries(counts.map((c) => [c._id.toString(), c.count]));
  const withCounts = departments.map((d) => ({ ...d.toObject(), employeeCount: countMap[d._id.toString()] || 0 }));
  res.json(withCounts);
};

const updateDepartment = async (req, res) => {
  const dept = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!dept) return res.status(404).json({ message: 'Department not found' });
  res.json(dept);
};

const deleteDepartment = async (req, res) => {
  const inUse = await Employee.countDocuments({ department: req.params.id });
  if (inUse > 0) return res.status(400).json({ message: `Cannot delete — ${inUse} employee(s) assigned` });
  const dept = await Department.findByIdAndDelete(req.params.id);
  if (!dept) return res.status(404).json({ message: 'Department not found' });
  res.json({ message: 'Department deleted' });
};

module.exports = { createDepartment, getDepartments, updateDepartment, deleteDepartment };