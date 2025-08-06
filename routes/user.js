const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const auth = require('../auth');

router.post('/register', userController.registerUser);

// Login
router.post('/login', userController.loginUser);

// Profile (requires login)
router.get('/profile', auth.verify, userController.getProfile);

// Update profile
router.put('/profile', auth.verify, userController.updateProfile);

// Reset password
router.put('/reset-password', userController.resetPassword);

module.exports = router;