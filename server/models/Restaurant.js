// server/models/Restaurant.js
// Restaurant model for storing restaurant data

const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide restaurant name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  location: {
    type: String,
    required: [true, 'Please provide location']
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  ratingCount: {
    type: Number,
    default: 0
  },
  cuisines: [{
    type: String,
    required: true
  }],
  deliveryTime: {
    type: String,
    required: true
  },
  deliveryFee: {
    type: Number,
    default: 0
  },
  minOrder: {
    type: Number,
    default: 0
  },
  vegOnly: {
    type: Boolean,
    default: false
  },
  isOpen: {
    type: Boolean,
    default: true
  },
  imageUrl: {
    type: String,
    default: 'https://via.placeholder.com/300x200?text=Restaurant'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for searching
restaurantSchema.index({ name: 'text', location: 'text' });

module.exports = mongoose.model('Restaurant', restaurantSchema);
