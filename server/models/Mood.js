const mongoose = require('mongoose');

const moodSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  moodType: { 
    type: String, 
    enum: ['happy', 'sad', 'energetic', 'calm', 'angry', 'anxious', 'fire'],
    required: true 
  },
  note: {
    type: String,
    maxlength: 200,
    default: ""
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Mood', moodSchema);