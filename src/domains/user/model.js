// src/domains/user/model.js

const mongoose = require('mongoose');

// Define the schema
const UserSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 50,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 1024,
  }
}, {
  timestamps: true,
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
