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
  if (req.session.userId) {
    return res.redirect("/profile");  // Redirect logged-in users to profile
  }
  let { userName, password } = req.body;

  // Validate userName length
  if (!userName || userName.length < 3 || userName.length > 50) {
    return res.status(400).json({ message: 'userName must be between 3 and 50 characters.' });
  }

  // Validate password length
  if (!password || password.length < 6 || password.length > 64) {
    return res.status(400).json({ message: 'Password must be between 6 and 64 characters.' });
  }

  // Check if userName already exists
  const existingUser = await User.findOne({ userName });
  if (existingUser) {
    return res.status(400).json({ message: 'userName is already taken' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({ userName, password: hashedPassword });

    await user.save();
    return res.status(200).json({ message: 'Signup successful!' });
  } catch (err) {
    return res.status(500).json({ message: `Error: ${err.message}` });
  }
});

// Login
router.post('/login', async (req, res) => {
  if (req.session.userId) {
    console.log('User is already logged in. Redirecting to profile...');
    return res.redirect("/profile");  // Redirect logged-in users to profile
  }

  const { userName, password } = req.body;

  // Validate input
  if (!userName) {
    return res.status(400).json({ message: 'Username is required' });
  }
  if (!password) {
    return res.status(400).json({ message: 'Password is required' });
  }

  try {
    // Find the user by username
    const user = await User.findOne({ userName });
    if (!user) {
      return res.status(400).json({ message: 'Username does not exist' });
    }

    // Compare the provided password with the stored hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect password' });
    }

    // Store user information in the session
    req.session.userId = user._id;
    req.session.userName = user.userName;

    // Send a success response
    res.status(200).json({ message: 'Login successful', redirect: '/profile' });
  } catch (err) {
    console.error(err);
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

// Profile route to get user data based on session
router.get('/profile', async (req, res) => {
  try {
    const userId = req.session.userId;

    if (!userId) {
      return res.status(401).json({ message: 'You must be logged in to view the profile' });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Pass the user data and title to the EJS template
    res.render('profile', { user, title: 'User Profile' });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).send('Internal Server Error');
  }
});


module.exports = router;