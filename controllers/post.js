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
  const { title, content, author } = req.body;
  const post = new Post({ title, content, author });
  await post.save();
  res.send({ message: 'Post created successfully' });
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
