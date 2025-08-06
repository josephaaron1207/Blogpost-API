const express = require('express');
const router = express.Router();
const postController = require('../controllers/post');
const auth = require('../auth');

// Public routes
router.get('/', postController.getPosts);

// Authenticated user routes
router.get('/my-posts', auth.verify, postController.getMyPosts); // must come BEFORE /:id
router.get('/:id', postController.getPost);
router.post('/', auth.verify, postController.createPost);
router.put('/:id', auth.verify, postController.updatePost);
router.delete('/:id', auth.verify, postController.deletePost);

module.exports = router;
