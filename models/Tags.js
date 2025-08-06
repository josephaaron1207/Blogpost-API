const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
  name: String,
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' }
});

const Tag = mongoose.model('Tag', tagSchema);

module.exports = Tag;