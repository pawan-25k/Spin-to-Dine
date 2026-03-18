// server/utils/recommendationEngine.js
// Smart recommendation engine for the Spin-to-Dine feature

const Menu = require('../models/Menu');
const Order = require('../models/Order');
const User = require('../models/User');

// Time slot mapping
const getTimeSlot = () => {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 11) return 'breakfast';
  if (hour >= 11 && hour < 16) return 'lunch';
  if (hour >= 16 && hour < 21) return 'dinner';
  return 'snacks';
};

// Category mapping based on time of day
const timeSlotCategories = {
  breakfast: ['breakfast', 'beverages'],
  lunch: ['lunch', 'dinner', 'beverages'],
  dinner: ['lunch', 'dinner', 'desserts'],
  snacks: ['snacks', 'beverages', 'desserts']
};

// Budget range mapping to price ranges
const budgetPriceRanges = {
  low: { min: 0, max: 150 },
  medium: { min: 0, max: 350 },
  high: { min: 0, max: 1000 }
};

/**
 * Generate smart dish suggestions for a user
 * Scoring formula:
 * Score = (PastOrderFrequency × 0.4) + (TimeMatch × 0.2) + (LocationTrend × 0.2) + (BudgetMatch × 0.2)
 * 
 * @param {string} userId - The user's ID
 * @returns {Array} - Array of suggested dishes with scores
 */
const generateSmartSuggestions = async (userId) => {
  try {
    // Get user data
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Get user's past orders
    const userOrders = await Order.find({ userId })
      .sort({ orderedAt: -1 })
      .limit(50);

    // Get all available menu items
    const allMenuItems = []
      .populate('restaurantId', 'name location rating');

    // Get time slot and categories
    const currentTimeSlot = getTimeSlot();
    const relevantCategories = timeSlotCategories[currentTimeSlot];
    
    // Get user's budget range
    const userBudget = budgetPriceRanges[user.budgetRange] || budgetPriceRanges.medium;

    // Calculate scores for each menu item
    const scoredItems = allMenuItems.map(menuItem => {
      const menu = menuItem;
      const restaurant = menu.restaurantId;

      // 1. Past Order Frequency Score (0.4 weight)
      const pastOrderFrequency = calculatePastOrderFrequency(userOrders, menu._id);

      // 2. Time Match Score (0.2 weight)
      const timeMatch = calculateTimeMatch(menu.category, currentTimeSlot, relevantCategories);

      // 3. Location Trend Score (0.2 weight)
      const locationTrend = calculateLocationTrend(userOrders, menu, user.location);

      // 4. Budget Match Score (0.2 weight)
      const budgetMatch = calculateBudgetMatch(menu.price, userBudget);

      // Calculate total score
      const totalScore = (
        (pastOrderFrequency * 0.4) +
        (timeMatch * 0.2) +
        (locationTrend * 0.2) +
        (budgetMatch * 0.2)
      );

      return {
        _id: menu._id,
        name: menu.name,
        price: menu.price,
        category: menu.category,
        veg: menu.veg,
        imageUrl: menu.imageUrl,
        restaurant: restaurant ? {
          _id: restaurant._id,
          name: restaurant.name,
          location: restaurant.location,
          rating: restaurant.rating
        } : null,
        scores: {
          pastOrderFrequency,
          timeMatch,
          locationTrend,
          budgetMatch,
          total: totalScore
        },
        timeSlot: currentTimeSlot
      };
    });

    // Sort by total score and return top 5
    const topSuggestions = scoredItems
      .sort((a, b) => b.scores.total - a.scores.total)
      .slice(0, 5);

    return topSuggestions;

  } catch (error) {
    console.error('Error in generateSmartSuggestions:', error);
    // Return popular items as fallback
    return getFallbackSuggestions();
  }
};

/**
 * Calculate past order frequency score (0-1)
 */
const calculatePastOrderFrequency = (userOrders, menuItemId) => {
  if (!userOrders || userOrders.length === 0) return 0.3;

  let orderCount = 0;
  userOrders.forEach(order => {
    order.items.forEach(item => {
      if (item.menuItemId && item.menuItemId.toString() === menuItemId.toString()) {
        orderCount++;
      }
    });
  });

  // Normalize to 0-1 range (max 10 orders gets score of 1)
  return Math.min(orderCount / 10, 1);
};

/**
 * Calculate time match score (0-1)
 */
const calculateTimeMatch = (category, currentTimeSlot, relevantCategories) => {
  if (relevantCategories.includes(category.toLowerCase())) {
    return 1;
  }
  return 0.2;
};

/**
 * Calculate location trend score (0-1)
 */
const calculateLocationTrend = (userOrders, menuItem, userLocation) => {
  // In a real app, this would check location-based trends
  // For now, we'll use restaurant rating as a proxy
  const restaurant = menuItem.restaurantId;
  if (!restaurant) return 0.3;

  // Normalize rating to 0-1 (assuming max rating of 5)
  return restaurant.rating ? restaurant.rating / 5 : 0.5;
};

/**
 * Calculate budget match score (0-1)
 */
const calculateBudgetMatch = (price, budgetRange) => {
  const { min, max } = budgetRange;
  
  if (price >= min && price <= max) {
    // Within budget - calculate how well it fits
    const range = max - min;
    const position = price - min;
    return 1 - (position / range) * 0.5; // Best fit gets 1, at edge gets 0.5
  } else if (price < min) {
    // Below minimum - still good
    return 0.8;
  } else {
    // Above budget - penalize
    const excess = price - max;
    return Math.max(0, 1 - (excess / 100)); // Reduce score for being over budget
  }
};

/**
 * Get fallback suggestions (popular items) if user has no history
 */
const getFallbackSuggestions = async () => {
  const popularItems = await Menu.find({ available: true })
    .populate('restaurantId', 'name location rating')
    .sort({ popularity: -1 })
    .limit(5);

  return popularItems.map(item => ({
    _id: item._id,
    name: item.name,
    price: item.price,
    category: item.category,
    veg: item.veg,
    imageUrl: item.imageUrl,
    restaurant: item.restaurantId,
    scores: {
      pastOrderFrequency: 0,
      timeMatch: 0.5,
      locationTrend: 0.5,
      budgetMatch: 0.5,
      total: 0.5
    },
    timeSlot: getTimeSlot()
  }));
};

module.exports = {
  generateSmartSuggestions,
  getTimeSlot
};
