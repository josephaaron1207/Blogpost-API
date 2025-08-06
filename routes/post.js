const express = require('express');
const router = express.Router();
const postController = require('../controllers/post');
const auth = require('../auth');

// Public routes
router.get('/', postController.getPosts);
router.get('/:id', postController.getPost);

// User-specific routes
router.get('/my-posts', auth.verify, postController.getMyPosts);
router.post('/', auth.verify, postController.createPost);
router.put('/:id', auth.verify, postController.updatePost);
router.delete('/:id', auth.verify, postController.deletePost); // allow users to delete their own posts

// If you still want admin to delete ANY post, add a separate route
router.delete('/admin/:id', auth.verify, auth.isAdmin, postController.adminDeletePost);

module.exports = router;
