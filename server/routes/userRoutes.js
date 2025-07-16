
const express = require('express');
const { register, login, getCurrentUser } = require('../controllers/authController');
const auth = require('../middleware/auth');
const User = require('../models/User'); // Add this import (missing in your code)

const router = express.Router();

// Auth Routes
router.post('/register', register);
router.post('/login', login);
router.get('/me', auth, getCurrentUser);

// Push Notification Route (Improved)
router.post('/save-push-token', auth, async (req, res) => {
  try {
    // Validate token exists in request
    if (!req.body.token) {
      return res.status(400).json({ error: "Push token is required" });
    }

    // Update user with token (and clear if token is empty string)
    const update = req.body.token.trim() === "" 
      ? { $unset: { pushToken: 1 } } // Remove token if empty
      : { pushToken: req.body.token };

    await User.findByIdAndUpdate(req.user.id, update);

    res.status(200).json({ 
      success: true,
      action: update.$unset ? "removed" : "saved"
    });
  } catch (err) {
    console.error("Push token error:", err);
    res.status(500).json({ error: "Server error saving token" });
  }
});

module.exports = router ;

