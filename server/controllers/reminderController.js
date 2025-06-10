// controllers/reminderController.js

const Reminder = require('../models/reminderModel.js');
const { sendEmail } = require('../utils/mailer'); // import your mailer
const User = require('../models/User'); // import your User model


const getReminder = async (req, res) => {
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
};

module.exports = {
  getReminder,
  // setReminder: async (req, res) => {
  //   try {
  //     const { time } = req.body;
  //     const reminder = await Reminder.findOneAndUpdate(
  //       { userId: req.user._id },
  //       { time, enabled: true },
  //       { upsert: true, new: true }
  //     );
  //     res.json(reminder);
  //   } catch (err) {
  //     console.error('[SET] Reminder error:', err);
  //     res.status(500).json({ error: 'Failed to set reminder' });
  //   }
  // },








//   setReminder: async (req, res) => {
//   try {
//     const { time } = req.body;

//     // Save or update the reminder
//     const reminder = await Reminder.findOneAndUpdate(
//       { userId: req.user._id },
//       { time, enabled: true },
//       { upsert: true, new: true }
//     );

//     // Schedule the email
//     const now = new Date();
//     const [hour, minute] = time.split(':').map(Number);

//     const scheduledTime = new Date(now);
//     scheduledTime.setHours(hour, minute, 0, 0);

//     // If time has already passed for today, set it for tomorrow
//     if (scheduledTime < now) {
//       scheduledTime.setDate(scheduledTime.getDate() + 1);
//     }

//     const delay = scheduledTime.getTime() - now.getTime();

//     setTimeout(() => {
//       sendEmail({ to: req.user.email, name: req.user.name });
//     }, delay);

//     res.json({ success: true, message: 'Reminder set and email scheduled' });
//   } catch (err) {
//     console.error('[SET] Reminder error:', err);
//     res.status(500).json({ error: 'Failed to set reminder' });
//   }
// },


setReminder: async (req, res) => {
  try {
    const { time } = req.body;

    console.log('User ID from token:', req.user._id);

    // Save or update the reminder
    const reminder = await Reminder.findOneAndUpdate(
      { userId: req.user._id },
      { time, enabled: true },
      { upsert: true, new: true }
    );

    // Fetch user info
    const user = await User.findById(req.user._id);
    console.log('Fetched user:', user);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const now = new Date();
    const [hour, minute] = time.split(':').map(Number);

    const scheduledTime = new Date(now);
    scheduledTime.setHours(hour, minute, 0, 0);

    if (scheduledTime < now) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    const delay = scheduledTime.getTime() - now.getTime();

    console.log(`Scheduling email in ${delay}ms to:`, user.email);

    // setTimeout(() => {
    //   console.log('Sending email to:', user.email);
    //   sendEmail({ to: user.email });
    // }, delay);

    res.json({ success: true, message: 'Reminder set and email scheduled' });
  } catch (err) {
    console.error('[SET] Reminder error:', err);
    res.status(500).json({ error: 'Failed to set reminder' });
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
  }  
};

