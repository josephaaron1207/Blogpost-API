const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const auth = require('../auth');

router.get('/', postController.getPosts);
router.get('/:id', postController.getPost);
router.post('/', auth.verify, postController.createPost);
router.put('/:id', auth.verify, postController.updatePost);
router.delete('/:id', auth.verify, auth.isAdmin, postController.deletePost);

module.exports = router;