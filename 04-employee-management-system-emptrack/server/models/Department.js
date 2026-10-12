const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    description: { type: String, default: '' },
    color: { type: String, default: '#0d9488' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Department', departmentSchema);