const mongoose = require('mongoose');

// Define the schema
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    minlength: 3,
    maxlength: 50,
    default: null,   // Optional: Default to null
  },
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
  },
  bio: {
    type: String,
    trim: true,
    maxlength: 80, // Up to 80 characters
    default: '', // Optional: Default to an empty string
  },
  links: {
    youtube: {
      type: String,
      trim: true,
      validate: {
        validator: (v) => !v || /^https:\/\/(www\.)?youtube\.com\/.+/.test(v),
        message: 'Invalid YouTube URL',
      },
    },
    instagram: {
      type: String,
      trim: true,
      validate: {
        validator: (v) => !v || /^https:\/\/(www\.)?instagram\.com\/.+/.test(v),
        message: 'Invalid Instagram URL',
      },
    },
    tiktok: {
      type: String,
      trim: true,
      validate: {
        validator: (v) => !v || /^https:\/\/(www\.)?tiktok\.com\/.+/.test(v),
        message: 'Invalid TikTok URL',
      },
    },
  },
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to other User documents
    },
  ],
  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to other User documents
    },
  ],
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post', // Reference to a Post model (if posts are implemented)
    },
  ],
}, {
  timestamps: true,
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
