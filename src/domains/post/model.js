const mongoose = require('mongoose');

// Define the schema
const PostSchema = new mongoose.Schema({
  caption: {
    type: String,
    trim: true,
    maxlength: 300, // Limit caption length
  },
  mediaUrl: {
    type: String,
    required: true, // Media (image/video) is required
  },
  mediaType: {
    type: String,
    enum: ['image', 'video'], // Restrict media types
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Users who liked the post
    },
  ],
  comments: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // User who commented
        required: true,
      },
      text: {
        type: String,
        required: true,
        maxlength: 300, // Limit comment length
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  tags: [
    {
      type: String, // Tags like hashtags or mentions
      trim: true,
    },
  ],
}, {
  timestamps: true, // Automatically add createdAt and updatedAt fields
});

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;
