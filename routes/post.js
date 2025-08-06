// routes/post.js
const express = require('express');
const router = express.Router();
const postController = require('../controllers/post');
const auth = require('../auth');

// Public routes
router.get('/', postController.getPosts);
router.get('/:id', postController.getPost);

// Authenticated user routes
router.get('/my-posts', auth.verify, postController.getMyPosts);
router.post('/', auth.verify, postController.createPost);
router.put('/:id', auth.verify, postController.updatePost);

// Delete route — user can delete their own, admin can delete any
router.delete('/:id', auth.verify, postController.deletePost);

// (Optional) Admin-only route: delete any post explicitly
router.delete('/admin/:id', auth.verify, auth.isAdmin, postController.deletePost);

module.exports = router;
