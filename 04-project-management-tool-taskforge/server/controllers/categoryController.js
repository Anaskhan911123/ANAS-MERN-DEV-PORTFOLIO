const Category = require('../models/Category');
const Task = require('../models/Task');

// @desc    Get all categories for logged-in user
// @route   GET /api/categories
const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ owner: req.user._id }).sort({ createdAt: -1 });
    res.json(categories);
  } catch (error) {
    next(error);
  }
};

// @desc    Create category
// @route   POST /api/categories
const createCategory = async (req, res, next) => {
  try {
    const { name, color } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    const category = await Category.create({
      name,
      color: color || '#6366F1',
      owner: req.user._id,
    });

    res.status(201).json(category);
  } catch (error) {
    next(error);
  }
};

// @desc    Update category
// @route   PUT /api/categories/:id
const updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findOne({ _id: req.params.id, owner: req.user._id });

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    category.name = req.body.name || category.name;
    category.color = req.body.color || category.color;

    const updated = await category.save();
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findOne({ _id: req.params.id, owner: req.user._id });

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Unassign category from any tasks using it
    await Task.updateMany(
      { category: category._id, owner: req.user._id },
      { $set: { category: null } }
    );

    await category.deleteOne();
    res.json({ message: 'Category removed' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };