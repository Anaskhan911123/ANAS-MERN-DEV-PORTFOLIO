const Employee = require('../models/Employee');
const Department = require('../models/Department');

const getSummary = async (req, res) => {
  const [total, active, onLeave, terminated] = await Promise.all([
    Employee.countDocuments(),
    Employee.countDocuments({ status: 'active' }),
    Employee.countDocuments({ status: 'on-leave' }),
    Employee.countDocuments({ status: 'terminated' }),
  ]);
  const departmentCount = await Department.countDocuments();

  const byDepartment = await Employee.aggregate([
    { $group: { _id: '$department', count: { $sum: 1 }, totalSalary: { $sum: '$salary' } } },
    { $lookup: { from: 'departments', localField: '_id', foreignField: '_id', as: 'dept' } },
    { $unwind: '$dept' },
    { $project: { name: '$dept.name', color: '$dept.color', count: 1, totalSalary: 1 } },
    { $sort: { count: -1 } },
  ]);

  const recentHires = await Employee.find().populate('department', 'name color').sort('-joinDate').limit(5);

  res.json({ total, active, onLeave, terminated, departmentCount, byDepartment, recentHires });
};

module.exports = { getSummary };