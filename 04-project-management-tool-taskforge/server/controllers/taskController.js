const Task = require('../models/Task');

// @desc    Get all tasks for logged-in user (with optional filters)
// @route   GET /api/tasks
const getTasks = async (req, res, next) => {
  try {
    const { status, category, priority } = req.query;

    const filter = { owner: req.user._id };
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (priority) filter.priority = priority;

    const tasks = await Task.find(filter)
      .populate('category', 'name color')
      .sort({ dueDate: 1 });

    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, owner: req.user._id }).populate(
      'category',
      'name color'
    );

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    next(error);
  }
};

// @desc    Create task
// @route   POST /api/tasks
const createTask = async (req, res, next) => {
  try {
    const { title, description, category, priority, status, dueDate } = req.body;

    if (!title || !dueDate) {
      return res.status(400).json({ message: 'Title and due date are required' });
    }

    const task = await Task.create({
      title,
      description,
      category: category || null,
      priority,
      status,
      dueDate,
      owner: req.user._id,
    });

    const populated = await task.populate('category', 'name color');
    res.status(201).json(populated);
  } catch (error) {
    next(error);
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const fields = ['title', 'description', 'category', 'priority', 'status', 'dueDate'];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        task[field] = req.body[field];
      }
    });

    // Reset reminder flag if due date changes
    if (req.body.dueDate) {
      task.reminderSent = false;
    }

    const updated = await task.save();
    const populated = await updated.populate('category', 'name color');
    res.json(populated);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await task.deleteOne();
    res.json({ message: 'Task removed' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get tasks due soon or overdue (reminders)
// @route   GET /api/tasks/reminders
const getReminders = async (req, res, next) => {
  try {
    const now = new Date();
    const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const overdue = await Task.find({
      owner: req.user._id,
      status: { $ne: 'done' },
      dueDate: { $lt: now },
    }).populate('category', 'name color');

    const dueSoon = await Task.find({
      owner: req.user._id,
      status: { $ne: 'done' },
      dueDate: { $gte: now, $lte: in24h },
    }).populate('category', 'name color');

    res.json({ overdue, dueSoon });
  } catch (error) {
    next(error);
  }
};

module.exports = { getTasks, getTaskById, createTask, updateTask, deleteTask, getReminders };