const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe, updateProfile, changePassword, logoutUser } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);
router.post('/logout', protect, logoutUser);

module.exports = router;