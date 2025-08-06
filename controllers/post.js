// controllers/postController.js
const Post = require('../models/Post');

// Get all posts
exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate('author', 'firstName lastName email');
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts', error });
  }
};

// Get single post
exports.getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'firstName lastName email');
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching post', error });
  }
};

// Get posts for logged-in user
exports.getMyPosts = async (req, res) => {
  try {
    const posts = await Post.find({ author: req.user.id });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching your posts', error });
  }
};

// Create post
exports.createPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const newPost = new Post({
      title,
      content,
      author: req.user.id,
    });
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    res.status(500).json({ message: 'Error creating post', error });
  }
};

// Update post
exports.updatePost = async (req, res) => {
  try {
    const updatedPost = await Post.findOneAndUpdate(
      { _id: req.params.id, author: req.user.id },
      req.body,
      { new: true }
    );
    if (!updatedPost) return res.status(404).json({ message: 'Post not found or not authorized' });
    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: 'Error updating post', error });
  }
};

// Delete post
exports.deletePost = async (req, res) => {
  try {
    const deletedPost = await Post.findOneAndDelete({
      _id: req.params.id,
      author: req.user.id,
    });
    if (!deletedPost) return res.status(404).json({ message: 'Post not found or not authorized' });
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting post', error });
  }
};
