// server/controllers/restaurantController.js
// Restaurant controller for handling restaurant and menu operations

const Restaurant = require('../models/Restaurant');
const Menu = require('../models/Menu');

// @desc    Get all restaurants
// @route   GET /api/restaurants
// @access  Public
const getRestaurants = async (req, res) => {
  try {
    const { location, rating, price, veg, search, page = 1, limit = 10 } = req.query;

    let query = {};

    // Filter by location
    if (location) {
      query.location = location;
    }

    // Filter by minimum rating
    if (rating) {
      query.rating = { $gte: parseFloat(rating) };
    }

    // Filter by veg-only
    if (veg === 'true') {
      query.vegOnly = true;
    }

    // Search by name or cuisine
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { cuisines: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;

    const restaurants = await Restaurant.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ rating: -1 });

    const total = await Restaurant.countDocuments(query);

    res.json({
      restaurants,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single restaurant
// @route   GET /api/restaurants/:id
// @access  Public
const getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get restaurant menu
// @route   GET /api/restaurants/:id/menu
// @access  Public
const getRestaurantMenu = async (req, res) => {
  try {
    // Look for all menu items that belong to this restaurant's ID
    const menu = await Menu.find({ restaurantId: req.params.id });

    // It's okay if a menu is empty, but we'll return an empty array []
    // so the frontend doesn't crash.
    res.json(menu || []); 
  } catch (error) {
    console.error("Menu Fetch Error:", error.message);
    res.status(500).json({ message: "Error fetching menu items" });
  }
};
// @desc    Get all menu items
// @route   GET /api/restaurants/menu/all
// @access  Public
const getAllMenuItems = async (req, res) => {
  try {
    const { category, veg, minPrice, maxPrice, search } = req.query;

    let query = { available: true };

    if (category) {
      query.category = category;
    }

    if (veg === 'true') {
      query.veg = true;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const menu = await Menu.find(query)
      .populate('restaurantId', 'name location rating')
      .sort({ popularity: -1 });

    res.json(menu);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get popular dishes across all restaurants
// @route   GET /api/restaurants/popular-dishes
// @access  Public
const getPopularDishes = async (req, res) => {
  try {
    const dishes = await Menu.find({ available: true })
      .populate('restaurantId', 'name location')
      .sort({ popularity: -1 })
      .limit(20);

    res.json(dishes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getRestaurants,
  getRestaurantById,
  getRestaurantMenu,
  getAllMenuItems,
  getPopularDishes
};
