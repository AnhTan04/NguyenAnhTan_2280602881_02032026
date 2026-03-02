
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Role = require('../models/Role');


// Create User
router.post('/', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all Users (not deleted)
router.get('/', async (req, res) => {
  try {
    const users = await User.find({ deleted: false }).populate('role');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get User by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id, deleted: false }).populate('role');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update User
router.put('/:id', async (req, res) => {
  try {
    const user = await User.findOneAndUpdate({ _id: req.params.id, deleted: false }, req.body, { new: true });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Soft Delete User
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findOneAndUpdate({ _id: req.params.id, deleted: false }, { deleted: true }, { new: true });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User soft deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Enable User (set status=true)
router.post('/enable', async (req, res) => {
  const { email, username } = req.body;
  try {
    const user = await User.findOne({ email, username, deleted: false });
    if (!user) return res.status(404).json({ error: 'User not found' });
    user.status = true;
    await user.save();
    res.json({ message: 'User enabled', user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Disable User (set status=false)
router.post('/disable', async (req, res) => {
  const { email, username } = req.body;
  try {
    const user = await User.findOne({ email, username, deleted: false });
    if (!user) return res.status(404).json({ error: 'User not found' });
    user.status = false;
    await user.save();
    res.json({ message: 'User disabled', user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


module.exports = router;
