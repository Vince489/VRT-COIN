const Post = require('./model'); // Assuming the Post schema is in `src/domains/post/model.js`

// Create a new post
exports.createPost = async (req, res) => {
  try {
    const { caption, mediaUrl, mediaType } = req.body;
    const createdBy = req.user._id; // Assuming `req.user` is populated by middleware
    const post = new Post({ caption, mediaUrl, mediaType, createdBy });
    await post.save();
    res.status(201).json({ message: 'Post created successfully', post });
  } catch (error) {
    res.status(500).json({ message: 'Error creating post', error: error.message });
  }
};

// Like a post
exports.likePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user._id; // Assuming `req.user` is populated by middleware
    const post = await Post.findById(postId);

    if (!post) return res.status(404).json({ message: 'Post not found' });

    // Check if user has already liked the post
    if (post.likes.includes(userId)) {
      return res.status(400).json({ message: 'You have already liked this post' });
    }

    post.likes.push(userId);
    await post.save();
    res.status(200).json({ message: 'Post liked successfully', likes: post.likes.length });
  } catch (error) {
    res.status(500).json({ message: 'Error liking post', error: error.message });
  }
};

// Add a comment to a post
exports.addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { text } = req.body;
    const userId = req.user._id; // Assuming `req.user` is populated by middleware

    const post = await Post.findById(postId);

    if (!post) return res.status(404).json({ message: 'Post not found' });

    post.comments.push({ user: userId, text });
    await post.save();
    res.status(201).json({ message: 'Comment added successfully', comments: post.comments });
  } catch (error) {
    res.status(500).json({ message: 'Error adding comment', error: error.message });
  }
};
