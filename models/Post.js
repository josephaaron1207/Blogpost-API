const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  author: String,
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }]
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;