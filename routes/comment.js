const express = require('express');
const router = express.Router();
const commentController = require('../controllers/comment');
const auth = require('../auth');

// Public: view comments
router.get('/:postId', commentController.getComments);

// Authenticated: add, edit, delete
router.post('/:postId', auth.verify, commentController.addComment);
router.put('/:commentId', auth.verify, commentController.updateComment);
router.delete('/:commentId', auth.verify, commentController.deleteComment);

module.exports = router;
