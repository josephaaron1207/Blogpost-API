const Comment = require('../models/Comment');

// Get comments for a post
exports.getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate('author', 'email');
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching comments' });
  }
};

// Add a comment
exports.addComment = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ message: 'Content is required' });
    }

    const comment = new Comment({
      content,
      author: req.user.id,
      post: req.params.postId,
    });

    await comment.save();
    const populated = await comment.populate('author', 'email');

    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: 'Error adding comment' });
  }
};

// Edit comment (owner only)
exports.updateComment = async (req, res) => {
  try {
    const { content } = req.body;
    const comment = await Comment.findOneAndUpdate(
      { _id: req.params.commentId, author: req.user.id },
      { content },
      { new: true }
    ).populate('author', 'email');

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found or not authorized' });
    }

    res.json(comment);
  } catch (err) {
    res.status(500).json({ message: 'Error updating comment' });
  }
};

// Delete comment (owner or admin)
exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    const isOwner = comment.author.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    await comment.deleteOne();
    res.json({ message: 'Comment deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting comment' });
  }
};
