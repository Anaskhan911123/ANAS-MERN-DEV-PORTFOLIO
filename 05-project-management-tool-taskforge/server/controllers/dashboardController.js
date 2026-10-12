const Task = require('../models/Task');
const Category = require('../models/Category');
const mongoose = require('mongoose');

// @desc    Get dashboard stats: overall + per-category progress
// @route   GET /api/dashboard/stats
const getStats = async (req, res, next) => {
  try {
    const ownerId = req.user._id;

    const [total, completed, inProgress, todo, overdue] = await Promise.all([
      Task.countDocuments({ owner: ownerId }),
      Task.countDocuments({ owner: ownerId, status: 'done' }),
      Task.countDocuments({ owner: ownerId, status: 'in-progress' }),
      Task.countDocuments({ owner: ownerId, status: 'todo' }),
      Task.countDocuments({ owner: ownerId, status: { $ne: 'done' }, dueDate: { $lt: new Date() } }),
    ]);

    // Per-category progress
    const categoryStats = await Task.aggregate([
      { $match: { owner: new mongoose.Types.ObjectId(ownerId) } },
      {
        $group: {
          _id: '$category',
          total: { $sum: 1 },
          completed: { $sum: { $cond: [{ $eq: ['$status', 'done'] }, 1, 0] } },
        },
      },
      {
        $lookup: {
          from: 'categories',
          localField: '_id',
          foreignField: '_id',
          as: 'categoryInfo',
        },
      },
      { $unwind: { path: '$categoryInfo', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          name: { $ifNull: ['$categoryInfo.name', 'Uncategorized'] },
          color: { $ifNull: ['$categoryInfo.color', '#94A3B8'] },
          total: 1,
          completed: 1,
          progress: {
            $cond: [
              { $eq: ['$total', 0] },
              0,
              { $multiply: [{ $divide: ['$completed', '$total'] }, 100] },
            ],
          },
        },
      },
    ]);

    res.json({
      overall: {
        total,
        completed,
        inProgress,
        todo,
        overdue,
        completionRate: total === 0 ? 0 : Math.round((completed / total) * 100),
      },
      categoryStats,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getStats };