const Member = require('../models/Member');

// GET /api/members
exports.getMembers = async (req, res) => {
  try {
    const members = await Member.find().sort({ createdAt: -1 });
    res.json(members);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/members/:id
exports.getMemberById = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) return res.status(404).json({ message: 'Member not found' });
    res.json(member);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/members
exports.createMember = async (req, res) => {
  try {
    const { name, email, phone, membershipId } = req.body;
    if (!name || !email || !membershipId) {
      return res.status(400).json({ message: 'Name, email, and membershipId are required' });
    }

    const existing = await Member.findOne({ $or: [{ email }, { membershipId }] });
    if (existing) {
      return res.status(400).json({ message: 'Member with this email or membershipId already exists' });
    }

    const member = await Member.create({ name, email, phone, membershipId });
    res.status(201).json(member);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/members/:id
exports.updateMember = async (req, res) => {
  try {
    const member = await Member.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!member) return res.status(404).json({ message: 'Member not found' });
    res.json(member);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/members/:id
exports.deleteMember = async (req, res) => {
  try {
    const member = await Member.findByIdAndDelete(req.params.id);
    if (!member) return res.status(404).json({ message: 'Member not found' });
    res.json({ message: 'Member deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};