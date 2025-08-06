const Post = require('../models/Post');
const Comment = require('../models/Comment');

exports.getPosts = async (req, res) => {
  const posts = await Post.find().populate('comments');
  res.send(posts);
};

exports.getPost = async (req, res) => {
  const id = req.params.id;
  const post = await Post.findById(id).populate('comments');
  res.send(post);
};

exports.getMyPosts = async (req, res) => {
  try {
    const posts = await Post.find({ author: req.user.id });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Error fetching user's posts" });
  }
};

exports.createPost = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" });
    }

    const post = new Post({
      title,
      content,
      author: req.user.id, // ✅ use the user from token
    });

    await post.save();
    res.status(201).json({ message: "Post created successfully", post });
  } catch (err) {
    console.error("Error creating post:", err);
    res.status(500).json({ message: "Error creating post" });
  }
};

exports.updatePost = async (req, res) => {
  const id = req.params.id;
  const { title, content, author } = req.body;
  const post = await Post.findByIdAndUpdate(id, { title, content, author }, { new: true });
  res.send(post);
};

//[SECTION] Delete post
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Only the author OR an admin can delete
    if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: "Not authorized to delete this post" });
    }

    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting post" });
  }
};
