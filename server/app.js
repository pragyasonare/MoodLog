


require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cron = require('node-cron');
const nodemailer = require('nodemailer');


// === ROUTES ===
const userRoutes = require('./routes/userRoutes');
const moodRoutes = require('./routes/moodRoutes');

// === MODELS ===
const Reminder = require('./models/reminderModel');
// const sendEmail = require('./utils/mailer.js')

const { sendEmail } = require('./utils/mailer.js');


const app = express();

// =====================================
// 1. ENVIRONMENT VARIABLE CHECKS
// =====================================
if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
  console.error('❌ Missing critical environment variables');
  process.exit(1);
}

// =====================================
// 2. DATABASE CONNECTION WITH VERIFICATION
// =====================================
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000 // 5 second timeout
    });
    console.log('✅ MongoDB Connected');

    // Verify collections exist
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📁 Collections:', collections.map(c => c.name));
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err.message);
    process.exit(1);
  }
};

// =====================================
// 3. JWT CONFIGURATION TEST
// =====================================
const testJWT = () => {
  try {
    const token = jwt.sign({ test: true }, process.env.JWT_SECRET, { expiresIn: '1s' });
    jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ JWT Configuration Valid');
  } catch (err) {
    console.error('❌ JWT Error:', err.message);
    process.exit(1);
  }
};

// =====================================
// 4. EXPRESS SETUP
// =====================================
app.use(cors());
app.use(express.json());

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    dbState: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/moods', moodRoutes);

// =====================================
// 5. EMAIL SETUP (USING GMAIL + APP PASSWORD)
// =====================================
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,       // your Gmail address
    pass: process.env.GMAIL_APP_PASS    // your Gmail App Password
  }
});

// =====================================
// 6. CRON JOB: CHECK REMINDERS EVERY MINUTE
// =====================================

cron.schedule('* * * * *', async () => {
  console.log('⏰ Checking reminders...');
  const now = new Date();
  const currentTime = now.toTimeString().slice(0, 5); // "HH:MM"

  try {
    const reminders = await Reminder.find({ 
      time: currentTime, 
      enabled: true 
    }).populate('userId');

    const results = await Promise.allSettled(
      reminders.map(async (reminder) => {
        try {
          await sendEmail({
            to: reminder.userId.email,
            subject: '⏰ Moodify Reminder!',
            text: `Hi there! This is your scheduled reminder for ${currentTime}.`,
            html: `<p>Hi there!</p><p>This is your scheduled reminder for ${currentTime}.</p>`
          });
          return { success: true, email: reminder.userId.email };
        } catch (err) {
          return { success: false, email: reminder.userId.email, error: err.message };
        }
      })
    );

    // Log results
    results.forEach(result => {
      if (result.value.success) {
        console.log(`✅ Sent to ${result.value.email}`);
      } else {
        console.error(`❌ Failed to send to ${result.value.email}: ${result.value.error}`);
      }
    });

  } catch (err) {
    console.error('❌ Database error:', err.message);
  }
});


// =====================================
// 7. SERVER STARTUP
// =====================================
const startServer = async () => {
  await connectDB();
  testJWT();

  app.listen(process.env.PORT, () => {
    console.log(`🚀 Server running on port ${process.env.PORT}`);
    console.log(`🔗 Try: http://localhost:${process.env.PORT}/api/health`);
  });
};

startServer();
