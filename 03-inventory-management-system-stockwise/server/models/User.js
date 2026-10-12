const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // will be hashed before saving
  role: { type: String, default: 'Operations' },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);