const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const auth = require('../auth');

router.get('/:postId', commentController.getComments);
router.post('/:postId', auth.verify, commentController.createComment);
router.delete('/:id', auth.verify, auth.isAdmin, commentController.deleteComment);

module.exports = router;