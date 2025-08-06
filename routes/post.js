// routes/post.js
const express = require('express');
const router = express.Router();
const postController = require('../controllers/post');
const auth = require('../auth');

router.get('/', postController.getPosts);
router.get('/my-posts', auth.verify, postController.getMyPosts);
router.get('/:id', postController.getPost);
router.post('/', auth.verify, postController.createPost);
router.put('/:id', auth.verify, postController.updatePost);
router.delete('/:id', auth.verify, postController.deletePost);

module.exports = router;
