
const express = require('express');
const router = express.Router();
const {
  saveMood,
  getHistory,
  updateLatestMood,
  getLimitedJournals,
  updateJournal,
  getWeeklyInsights
} = require('../controllers/moodController');
const {
  getReminder,
  setReminder,
  deleteReminder
} = require('../controllers/reminderController');
const authMiddleware = require('../middleware/auth');

// Apply auth middleware to all routes
router.use(authMiddleware);

// Mood CRUD routes
router.post('/', saveMood);
router.get('/history', getHistory);
router.patch('/latest', updateLatestMood);
router.get('/journals', getLimitedJournals);
router.patch('/:id', updateJournal);

// Debug route for weekly insights
router.get('/insights/weekly', (req, res, next) => {
  console.log('User making request:', req.user);
  next();
}, getWeeklyInsights);

// Reminder routes
router.get('/reminders', getReminder);
router.post('/reminders', setReminder);
router.delete('/reminders', deleteReminder);

module.exports = router;