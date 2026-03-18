// server/routes/restaurantRoutes.js
// Restaurant routes

const express = require('express');
const router = express.Router();
const { 
  getRestaurants, 
  getRestaurantById, 
  getRestaurantMenu,
  getAllMenuItems,
  getPopularDishes
} = require('../controllers/restaurantController');

router.get('/', getRestaurants);
router.get('/menu/all', getAllMenuItems);
router.get('/popular-dishes', getPopularDishes);
router.get('/:id', getRestaurantById);
router.get('/:id/menu', getRestaurantMenu);

module.exports = router;
