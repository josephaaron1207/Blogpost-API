// controllers/post.js
const Post = require('../models/Post');

exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find(); // removed populate
    res.send(posts);
  } catch (err) {
    res.status(500).json({ message: "Error fetching posts" });
  }
};

exports.getPost = async (req, res) => {
  try {
    const id = req.params.id;
    const post = await Post.findById(id); // removed populate
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.send(post);
  } catch (err) {
    res.status(500).json({ message: "Error fetching post" });
  }
};

exports.getMyPosts = async (req, res) => {
  try {
    const posts = await Post.find({ author: req.user.id });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Error fetching user's posts" });
  }
};

// controllers/post.js
exports.createPost = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" });
    }

    const post = new Post({
      title,
      content,
      author: req.user.id, // ✅ get author from verified token
    });

    await post.save();
    res.status(201).json({ message: 'Post created successfully', post });
  } catch (err) {
    console.error('Error creating post:', err);
    res.status(500).json({ message: 'Error creating post' });
  }
};


exports.updatePost = async (req, res) => {
  try {
    const id = req.params.id;
    const { title, content } = req.body;
    const post = await Post.findOneAndUpdate(
      { _id: id, author: req.user.id },
      { title, content },
      { new: true }
    );
    if (!post) {
      return res.status(404).json({ message: "Post not found or not authorized" });
    }
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: "Error updating post" });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check ownership and role
    const isOwner = post.author.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Not authorized to delete this post" });
    }

    await post.deleteOne();

    // Log who deleted
    const deletedBy = isAdmin ? `Admin (${req.user.email || req.user.id})` 
                              : `Owner (${req.user.email || req.user.id})`;

    console.log(`✅ Post "${post.title}" deleted by ${deletedBy}`);

    res.json({
      message: `Post deleted successfully by ${isAdmin ? 'an admin' : 'the owner'}`,
    });
  } catch (err) {
    console.error("❌ Error deleting post:", err);
    res.status(500).json({ message: "Error deleting post" });
  }
};
