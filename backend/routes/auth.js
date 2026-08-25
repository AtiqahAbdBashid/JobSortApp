const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

// ============================================================
// REGULAR REGISTER (for testing)
// ============================================================
router.post('/register', authController.register);
router.get('/me', authMiddleware, authController.getUser);

// ============================================================
// GOOGLE OAUTH - ADD THESE
// ============================================================
router.get('/google', authController.googleAuth);
router.get('/google/callback', authController.googleCallback);

module.exports = router;