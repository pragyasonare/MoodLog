// controllers/reminderController.js

const Reminder = require('../models/reminderModel.js');
const User = require('../models/User'); // import your User model
const admin = require("firebase-admin"); // Add this

module.exports = {

  getReminder: async (req, res) => {
  try {
    const reminder = await Reminder.findOne({ userId: req.user._id });
    res.json(reminder || { time: null, enabled: false }); // Default response
  } catch (err) {
    console.error('[GET] Reminder error:', err);
    res.status(500).json({ 
      error: 'Failed to fetch reminder',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
},

  deleteReminder: async (req, res) => {
    try {
      await Reminder.deleteOne({ userId: req.user._id });
      res.json({ message: 'Reminder deleted' });
    } catch (err) {
      console.error('[DELETE] Reminder error:', err);
      res.status(500).json({ error: 'Failed to delete reminder' });
    }
  } ,

  //updated

   setReminder: async (req, res) => {
    try {
      const { time } = req.body;

      // Save/update reminder (unchanged)
      const reminder = await Reminder.findOneAndUpdate(
        { userId: req.user._id },
        { time, enabled: true },
        { upsert: true, new: true }
      );

      // Get user with pushToken
      const user = await User.findById(req.user._id);
      if (!user) return res.status(404).json({ error: 'User not found' });

      // =====================================
      // NEW: Send test push notification immediately
      // (Optional - helps verify setup)
      // =====================================
      if (user.pushToken) {
        try {
          await admin.messaging().send({
            token: user.pushToken,
            notification: { 
              title: "⏰ Reminder Set!", 
              body: `You'll get notifications at ${time}` 
            }
          });
          console.log("Test push sent successfully");
        } catch (pushError) {
          console.warn("Test push failed (non-critical):", pushError.message);
        }
      }

      res.json({ 
        success: true, 
        message: 'Reminder set',
        pushSupported: !!user.pushToken 
      });

    } catch (err) {
      console.error('[SET] Reminder error:', err);
      res.status(500).json({ error: 'Failed to set reminder' });
    }
  },

  // =====================================
  // NEW: Add this helper for cron jobs
  // =====================================
  sendScheduledReminder: async (userId) => {
    const user = await User.findById(userId);
    if (!user?.pushToken) return false;

    try {
      await admin.messaging().send({
        token: user.pushToken,
        notification: { 
          title: "MoodLog Reminder", 
          body: "Time to log your mood!" 
        }
      });
      return true;
    } catch (err) {
      if (err.code === 'messaging/invalid-registration-token') {
        await User.findByIdAndUpdate(userId, { $unset: { pushToken: 1 } });
      }
      console.error("Push failed:", err.message);
      return false;
    }
  } ,

};

