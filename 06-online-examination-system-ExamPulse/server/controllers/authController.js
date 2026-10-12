const jwt = require('jsonwebtoken');
const User = require('../models/User');

function signToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '2h',
  });
}

async function register(req, res, next) {
  try {
    const { name, rollNumber, email, password, role } = req.body;
    const user = await User.create({ name, rollNumber, email, password, role });
    const token = signToken(user);
    res.status(201).json({ token, user: user.toSafeObject() });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { rollNumber, password } = req.body;
    const user = await User.findOne({ rollNumber });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'That roll number or password is incorrect.' });
    }
    const token = signToken(user);
    res.json({ token, user: user.toSafeObject() });
  } catch (err) {
    next(err);
  }
}

async function me(req, res) {
  res.json({ user: req.user.toSafeObject ? req.user.toSafeObject() : req.user });
}

module.exports = { register, login, me };