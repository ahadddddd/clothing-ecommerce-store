const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  try {
    const newUser = await user.save();
    res.status(201).json({
      message: 'User registered successfully',
      userId: newUser._id,
      role: newUser.role,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.password !== req.body.password) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    res.json({
      message: 'Login successful',
      userId: user._id,
      role: user.role,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
