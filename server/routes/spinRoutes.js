// server/routes/spinRoutes.js
// Spin wheel / gamification routes

const express = require('express');
const router = express.Router();
const { getSuggestions, logSpin, getSpinHistory } = require('../controllers/spinController');
const { protect } = require('../middleware/authMiddleware');

router.get('/:userId', protect, getSuggestions);
router.post('/log', protect, logSpin);
router.get('/history/:userId', protect, getSpinHistory);

module.exports = router;
