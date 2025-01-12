// src/domains/user/routes.js

const express = require('express');
const bcrypt = require('bcrypt'); // Import bcrypt
const router = express.Router();
const User = require('./model'); // Import your User model


// Get all users exclude password
router.get('/', async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 }); // Excluding password field
    if (users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }
    res.status(200).json(users);
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
});

// Signup
router.post('/signup', async (req, res) => {
  let { userName, password } = req.body;

  console.log('Received data:', { userName, password });  // Check the received data

  // Validate userName length
  if (!userName || userName.length < 3 || userName.length > 50) {
    return res.status(400).json({ message: 'userName must be between 3 and 50 characters.' });
  }

  // Validate password length
  if (!password || password.length < 6 || password.length > 1024) {
    return res.status(400).json({ message: 'Password must be between 6 and 1024 characters.' });
  }

  // Check if userName already exists
  const existingUser = await User.findOne({ userName });
  if (existingUser) {
    return res.status(400).json({ message: 'userName is already taken' });
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({ userName, password: hashedPassword });

    const newUser = await user.save();
    res.redirect('/login');
  } catch (err) {
    res.status(400).json({ message: `Error: ${err.message}` });
  }
});


// Login
router.post('/login', async (req, res) => {
  const { userName, password } = req.body;

  // Validate input
  if (!userName || !password) {
    return res.status(400).json({ message: 'userName and password are required' });
  }

  try {
    // Find the user by username
    const user = await User.findOne({ userName });
    if (!user) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    // Compare the provided password with the stored hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    // If the password is correct, store user in session
    req.session.userId = user._id;
    req.session.userName = user.userName;

    // Redirect to the dashboard
    res.redirect('/dashboard');
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Server error', error: err.message });
    }
    res.redirect('/login');
  });
});

// Profile
router.get('/profile', (req, res) => {
  if (!req.session.userId) {
    return res.redirect('/login');
  }
  res.render('profile', { userName: req.session.userName });
});

// Edit Profile
router.post('/edit', async (req, res) => {
  const { newUserName, newPassword } = req.body;

  // Check if the user is authenticated
  if (!req.session.userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const updates = {};

    // If new username is provided, validate and update it
    if (newUserName) {
      const existingUser = await User.findOne({ userName: newUserName });
      if (existingUser) {
        return res.status(400).json({ message: 'Username is already taken' });
      }
      updates.userName = newUserName;
    }

    // If new password is provided, hash and update it
    if (newPassword) {
      const hashedPassword = await bcrypt.hash(newPassword, 12);
      updates.password = hashedPassword;
    }

    // Update the user in the database
    const updatedUser = await User.findByIdAndUpdate(req.session.userId, updates, { new: true });

    if (newPassword) {
      // If the password was changed, clear the session and redirect to login
      req.session.destroy((err) => {
        if (err) {
          return res.status(500).json({ message: 'Error logging out after password change' });
        }
        res.redirect('/login'); // Redirect to login page
      });
    } else {
      // If only username was changed, update session and redirect to dashboard
      if (newUserName) {
        req.session.userName = updatedUser.userName;
      }
      res.redirect('/dashboard'); // Redirect to dashboard
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;