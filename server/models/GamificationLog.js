// server/models/GamificationLog.js
// GamificationLog model for tracking spin wheel usage and recommendations

const mongoose = require('mongoose');

const gamificationLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  suggestedDish: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Menu',
    required: true
  },
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true
  },
  accepted: {
    type: Boolean,
    default: false
  },
  spinDate: {
    type: Date,
    default: Date.now
  },
  timeSlot: {
    type: String,
    enum: ['breakfast', 'lunch', 'dinner', 'snacks'],
    required: true
  },
  score: Number
});

module.exports = mongoose.model('GamificationLog', gamificationLogSchema);
