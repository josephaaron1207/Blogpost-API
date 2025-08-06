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
module.exports.deletePost = async (req, res) => {
    try {
      const post = await Post.findById(req.params.postId);
      if (!post) {
        return res.status(404).send({ message: "Post not found" });
      }
      if (post.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(401).send({ message: "You are not authorized to delete this post" });
      }
      await post.remove();
      res.send({ message: "Post deleted successfully" });
    } catch (err) {
      res.status(400).send({ message: "Error deleting post" });
    }
  };