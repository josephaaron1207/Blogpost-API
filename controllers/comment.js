const Comment = require('../models/Comment');
const Post = require('../models/Post');

exports.createComment = async (req, res) => {
  const { content, postId } = req.body;
  const comment = new Comment({ content, postId });
  await comment.save();
  const post = await Post.findById(postId);
  post.comments.push(comment._id);
  await post.save();
  res.send({ message: 'Comment created successfully' });
};

exports.getComments = async (req, res) => {
  const comments = await Comment.find().populate('postId');
  res.send(comments);
};

exports.getComment = async (req, res) => {
  const id = req.params.id;
  const comment = await Comment.findById(id).populate('postId');
  res.send(comment);
};

exports.updateComment = async (req, res) => {
  const id = req.params.id;
  const { content } = req.body;
  const comment = await Comment.findByIdAndUpdate(id, { content }, { new: true });
  res.send(comment);
};

exports.deleteComment = async (req, res) => {
  const id = req.params.id;
  await Comment.findByIdAndRemove(id);
  res.send({ message: 'Comment deleted successfully' });
};

//[SECTION] Delete comment
module.exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return res.status(404).send({ message: "Comment not found" });
    }
    if (comment.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).send({ message: "You are not authorized to delete this comment" });
    }
    await comment.remove();
    res.send({ message: "Comment deleted successfully" });
  } catch (err) {
    res.status(400).send({ message: "Error deleting comment" });
  }
};