const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const Pledge = require('../models/Pledge');
const bcrypt = require('bcryptjs');

// Create a new admin (sign up)
// Create a new admin (sign up)
router.post('/signup', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if admin already exists
    const adminExists = await Admin.findOne({ username });
    if (adminExists) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    // Hash the password before saving
    const salt = await bcrypt.genSalt(10); // Generate a salt for hashing
    const hashedPassword = await bcrypt.hash(password, salt); // Hash the password

    const newAdmin = new Admin({
      username,
      password: hashedPassword, // Store the hashed password
    });

    // Save the admin to the database
    await newAdmin.save();
    res.status(201).json({ message: 'Admin created successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error creating admin', error: err.message });
  }
});


router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // First check for admin
    const admin = await Admin.findOne({ username });
    if (admin) {
      const isMatch = await admin.comparePassword(password);
      if (isMatch) {
        return res.status(200).json({ message: 'Login successful', role: 'admin', username: admin.username });
      }
    }

    // If not admin, check for pledge
    const pledge = await Pledge.findOne({ firstName: username, lastName: password });
    if (pledge) {
      return res.status(200).json({ message: 'Login successful', role: 'pledge', username: pledge.firstName });
    }

    // If no match, return error
    return res.status(400).json({ message: 'Invalid credentials' });

  } catch (err) {
    res.status(500).json({ message: 'Error logging in', error: err.message });
  }
});

module.exports = router;
