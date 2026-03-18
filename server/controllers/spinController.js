// server/controllers/spinController.js
// Spin wheel controller for gamification feature

const Menu = require('../models/Menu');
const User = require('../models/User');
const Order = require('../models/Order');
const GamificationLog = require('../models/GamificationLog');
const { generateSmartSuggestions } = require('../utils/recommendationEngine');

// @desc    Get smart suggestions for spin wheel
// @route   GET /api/spin/:userId
// @access  Private
const getSuggestions = async (req, res) => {
  try {
    const { userId } = req.params;

    // Check if user is authorized
    if (req.user._id.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Get user's today's spin count
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todaySpins = await GamificationLog.countDocuments({
      userId,
      spinDate: { $gte: today }
    });

    if (todaySpins >= 3) {
      return res.status(400).json({ 
        message: 'Maximum spins reached for today',
        spinsRemaining: 0,
        nextReset: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      });
    }

    // Get smart suggestions using recommendation engine
    const suggestions = await generateSmartSuggestions(userId);

    res.json({
      suggestions,
      spinsRemaining: 3 - todaySpins,
      todaySpinCount: todaySpins
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Log a spin and record the result
// @route   POST /api/spin/log
// @access  Private
const logSpin = async (req, res) => {
  try {
    const { menuItemId, restaurantId, accepted, score, timeSlot } = req.body;
    const userId = req.user._id;

    // Validate required fields
    if (!menuItemId || !restaurantId) {
      return res.status(400).json({ message: 'Menu item and restaurant are required' });
    }

    // Check spin limit
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todaySpins = await GamificationLog.countDocuments({
      userId,
      spinDate: { $gte: today }
    });

    if (todaySpins >= 3) {
      return res.status(400).json({ message: 'Maximum spins reached for today' });
    }

    // Log the spin
    const log = await GamificationLog.create({
      userId,
      suggestedDish: menuItemId,
      restaurantId,
      accepted: accepted || false,
      timeSlot: timeSlot || getTimeSlot(),
      score: score || 0
    });

    res.status(201).json({
      message: accepted ? 'Dish added to order' : 'Spin logged',
      log
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's spin history
// @route   GET /api/spin/history/:userId
// @access  Private
const getSpinHistory = async (req, res) => {
  try {
    const { userId } = req.params;

    if (req.user._id.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const history = await GamificationLog.find({ userId })
      .populate('suggestedDish', 'name price imageUrl')
      .populate('restaurantId', 'name location')
      .sort({ spinDate: -1 })
      .limit(20);

    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Helper function to determine time slot
const getTimeSlot = () => {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 11) return 'breakfast';
  if (hour >= 11 && hour < 16) return 'lunch';
  if (hour >= 16 && hour < 21) return 'dinner';
  return 'snacks';
};

module.exports = {
  getSuggestions,
  logSpin,
  getSpinHistory
};
