const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

async function createUser(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const normalizedEmail = String(req.body.email || '').trim().toLowerCase();
  const existing = await User.findOne({ email: normalizedEmail });
  if (existing) {
    return res.status(409).json({ message: 'Email already exists' });
  }

  const hash = await bcrypt.hash(req.body.password, 10);
  const created = await User.create({
    name: req.body.name,
    email: normalizedEmail,
    password: hash,
    role: req.body.role || 'employee',
    department: req.body.department || '',
    availability: req.body.availability || 'free',
    skills: Array.isArray(req.body.skills) ? req.body.skills : []
  });

  const safeUser = await User.findById(created._id).select('-password -refreshToken');
  return res.status(201).json(safeUser);
}

async function getUsers(req, res) {
  const users = await User.find().select('-password -refreshToken').sort({ createdAt: -1 });
  res.json(users);
}

async function getUserById(req, res) {
  const user = await User.findById(req.params.id).select('-password -refreshToken');
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  return res.json(user);
}

async function updateUser(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const payload = { ...req.body };
  delete payload.refreshToken;

  if (payload.password) {
    payload.password = await bcrypt.hash(payload.password, 10);
  }

  const updated = await User.findByIdAndUpdate(req.params.id, payload, {
    new: true,
    runValidators: true
  }).select('-password -refreshToken');

  if (!updated) {
    return res.status(404).json({ message: 'User not found' });
  }

  return res.json(updated);
}

async function updateAvailability(req, res) {
  const { availability } = req.body;
  const updated = await User.findByIdAndUpdate(
    req.params.id,
    { availability },
    { new: true, runValidators: true }
  ).select('-password -refreshToken');

  if (!updated) {
    return res.status(404).json({ message: 'User not found' });
  }

  return res.json(updated);
}

async function deleteUser(req, res) {
  const removed = await User.findByIdAndDelete(req.params.id);
  if (!removed) {
    return res.status(404).json({ message: 'User not found' });
  }

  return res.json({ message: 'User removed' });
}

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  updateAvailability,
  deleteUser
};
