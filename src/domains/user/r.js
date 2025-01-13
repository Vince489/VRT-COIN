const express = require('express');
const bcrypt = require('bcrypt');
const User = require('./model'); // Adjust the path based on your file structure
const router = express.Router();

router.post('/login', async (req, res) => {
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
    res.status(200).json({ message: 'Login successful', redirect: '/dashboard' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
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
