
const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  time: { type: String, required: true }, // Format: "HH:MM"
  enabled: { type: Boolean, default: true }
});

module.exports = mongoose.model('Reminder', reminderSchema);
