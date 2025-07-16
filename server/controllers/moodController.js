 const Mood = require('../models/Mood');

// Save User's Mood
exports.saveMood = async (req, res) => {
  try {
    const mood = new Mood({
      userId: req.user.id,
      moodType: req.body.moodType || req.body.mood 
    });
    await mood.save();
    res.status(201).json(mood);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update latest mood with journal entry
exports.updateLatestMood = async (req, res) => {
  try {
    const mood = await Mood.findOneAndUpdate(
      { userId: req.user.id },
      { $set: { note: req.body.note } },
      { 
        sort: { createdAt: -1 },
        new: true
      }
    );
    
    if (!mood) {
      return res.status(404).json({ error: "No mood found to update" });
    }

    res.json({
      _id: mood._id,
      moodType: mood.moodType,
      note: mood.note,
      createdAt: mood.createdAt
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get limited journals for dashboard preview
exports.getLimitedJournals = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 3;
    const moods = await Mood.find({ 
      userId: req.user.id,
      note: { $exists: true, $ne: "" }
    })
    .sort({ createdAt: -1 })
    .limit(limit);

    res.json(moods);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get User's Mood History (only with notes)
exports.getHistory = async (req, res) => {
  try {
    const moods = await Mood.find({ 
      userId: req.user.id,
      note: { $exists: true, $ne: "" }
    }).sort({ createdAt: -1 });
    
    res.json(moods);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add this to your moodController.js
exports.updateJournal = async (req, res) => {
  try {
    const mood = await Mood.findOneAndUpdate(
      { 
        _id: req.params.id, 
        userId: req.user.id // Ensure user owns this entry
      },
      { note: req.body.note },
      { new: true }
    );
    
    if (!mood) {
      return res.status(404).json({ error: "Journal entry not found" });
    }

    res.json(mood);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getWeeklyInsights = async (req, res) => {
  try {
    let startDate, endDate = new Date();
    let timeRangeLabel = 'this week';

    // Calculate date ranges
    switch (req.query.range) {
      case 'last-week':
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 14); // 2 weeks ago
        endDate.setDate(endDate.getDate() - 7); // 1 week ago
        timeRangeLabel = 'last week';
        break;
      case 'last-month':
        startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 1); // Previous month
        startDate.setDate(1); // 1st of last month
        endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0); // Last day of last month
        timeRangeLabel = 'last month';
        break;
      default: // 'this-week'
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 7); // Past 7 days
    }

    // Get total entries for the period
    const totalEntries = await Mood.countDocuments({
      userId: req.user.id,
      createdAt: { $gte: startDate, $lte: endDate }
    });

    // Handle empty results
    if (totalEntries === 0) {
      return res.json({ 
        success: true,
        moodDistribution: [],
        totalEntries: 0,
        isEmpty: true,
        message: `You didn't log any moods ${timeRangeLabel}.`,
        timeRange: req.query.range || 'this-week',
        startDate,
        endDate
      });
    }

    // Aggregate mood data
    const moodDistribution = await Mood.aggregate([
      {
        $match: {
          userId: req.user.id,
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: "$moodType",
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          mood: "$_id",
          percentage: {
            $round: [
              { $multiply: [{ $divide: ["$count", totalEntries] }, 100] },
              1 // 1 decimal place
            ]
          },
          _id: 0
        }
      },
      { $sort: { percentage: -1 } } // Highest first
    ]);

    res.json({
      success: true,
      moodDistribution,
      totalEntries,
      timeRange: req.query.range || 'this-week',
      startDate,
      endDate
    });

  } catch (err) {
    console.error('Error in getWeeklyInsights:', err);
    res.status(500).json({ 
      success: false, 
      error: err.message,
      code: 'SERVER_ERROR'
    });
  }
};

//new

exports.setReminder = async (req, res) => {
  try {
    const { time } = req.body;
    const reminder = await Reminder.findOneAndUpdate(
      { userId: req.user._id },
      { time, enabled: true },
      { upsert: true, new: true }
    );
    res.json(reminder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
