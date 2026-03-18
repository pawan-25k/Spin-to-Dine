// client/src/components/SpinWheel.js
// Spin-to-Dine gamification wheel component

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import spinService from '../services/spinService';

const SpinWheel = () => {
  const { user, isAuthenticated } = useAuth();
  const { addToCart, restaurant: cartRestaurant } = useCart();
  const navigate = useNavigate();
  
  const [suggestions, setSuggestions] = useState([]);
  const [spinning, setSpinning] = useState(false);
  const [selectedDish, setSelectedDish] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [spinCount, setSpinCount] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchSuggestions();
  }, [isAuthenticated, navigate]);

  const fetchSuggestions = async () => {
    try {
      setLoading(true);
      const data = await spinService.getSuggestions(user._id);
      setSuggestions(data.suggestions || []);
      setSpinCount(data.todaySpinCount || 0);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load suggestions');
    } finally {
      setLoading(false);
    }
  };

  const handleSpin = () => {
    if (spinning || suggestions.length === 0 || spinCount >= 3) return;

    setSpinning(true);
    
    // Calculate random rotation (at least 5 full spins + random position)
    const newRotation = rotation + 1800 + Math.random() * 360;
    setRotation(newRotation);

    // After animation, show the result
    setTimeout(() => {
      // Select a dish based on rotation position
      const segmentAngle = 360 / suggestions.length;
      const normalizedRotation = newRotation % 360;
      const selectedIndex = Math.floor(normalizedRotation / segmentAngle);
      const dish = suggestions[suggestions.length - 1 - selectedIndex];
      
      setSelectedDish(dish);
      setShowModal(true);
      setSpinning(false);
      setSpinCount(prev => prev + 1);
      
      // Log the spin
      logSpin(dish);
    }, 3000);
  };

  const logSpin = async (dish) => {
    try {
      await spinService.logSpin({
        menuItemId: dish._id,
        restaurantId: dish.restaurant?._id,
        score: dish.scores?.total,
        timeSlot: dish.timeSlot
      });
    } catch (err) {
      console.error('Failed to log spin:', err);
    }
  };

  const handleAddToCart = () => {
    if (!selectedDish) return;

    const restaurantInfo = {
      _id: selectedDish.restaurant?._id,
      name: selectedDish.restaurant?.name,
      location: selectedDish.restaurant?.location
    };

    addToCart({
      _id: selectedDish._id,
      name: selectedDish.name,
      price: selectedDish.price,
      imageUrl: selectedDish.imageUrl,
      restaurant: selectedDish.restaurant
    }, restaurantInfo);

    setShowModal(false);
    setSelectedDish(null);
    navigate('/cart');
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedDish(null);
  };

  if (loading) {
    return (
      <div className="spin-container">
        <div className="loading-spinner">Loading your personalized recommendations...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="spin-container">
        <div className="error-message">{error}</div>
        <button onClick={fetchSuggestions} className="btn-primary">Try Again</button>
      </div>
    );
  }

  return (
    <div className="spin-container">
      <div className="spin-header">
        <h1>🎰 Spin-to-Dine</h1>
        <p>Spin the wheel for personalized dish recommendations!</p>
        <div className="spin-counter">
          Spins remaining today: <strong>{3 - spinCount}</strong>
        </div>
      </div>

      <div className="spin-wheel-wrapper">
        <div 
          className={`spin-wheel ${spinning ? 'spinning' : ''}`}
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          {suggestions.map((dish, index) => (
            <div 
              key={dish._id} 
              className="wheel-segment"
              style={{
                transform: `rotate(${index * (360 / suggestions.length)}deg)`
              }}
            >
              <span className="segment-text">{dish.name.substring(0, 15)}</span>
            </div>
          ))}
        </div>
        
        <button 
          className="spin-button"
          onClick={handleSpin}
          disabled={spinning || spinCount >= 3 || suggestions.length === 0}
        >
          {spinning ? 'Spinning...' : spinCount >= 3 ? 'No Spins Left' : 'SPIN!'}
        </button>
      </div>

      <div className="suggestions-list">
        <h3>Your Smart Suggestions</h3>
        <p className="suggestions-subtitle">
          Based on your preferences, order history, and time of day
        </p>
        <div className="suggestions-grid">
          {suggestions.map((dish, index) => (
            <div key={dish._id} className="suggestion-card" onClick={() => {
              setSelectedDish(dish);
              setShowModal(true);
            }}>
              <span className="suggestion-rank">#{index + 1}</span>
              <img 
                src={dish.imageUrl || 'https://via.placeholder.com/100x100?text=Dish'} 
                alt={dish.name}
              />
              <h4>{dish.name}</h4>
              <p className="suggestion-restaurant">{dish.restaurant?.name}</p>
              <p className="suggestion-price">₹{dish.price}</p>
              <div className="match-score">
                <span className="score-label">Match:</span>
                <div className="score-bar">
                  <div 
                    className="score-fill" 
                    style={{ width: `${(dish.scores?.total || 0) * 100}%` }}
                  ></div>
                </div>
                <span className="score-value">{Math.round((dish.scores?.total || 0) * 100)}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && selectedDish && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>&times;</button>
            <h2>🎉 You got: {selectedDish.name}</h2>
            <img 
              src={selectedDish.imageUrl || 'https://via.placeholder.com/200x200?text=Dish'} 
              alt={selectedDish.name}
              className="modal-image"
            />
            <div className="modal-details">
              <p><strong>Restaurant:</strong> {selectedDish.restaurant?.name}</p>
              <p><strong>Price:</strong> ₹{selectedDish.price}</p>
              <p><strong>Category:</strong> {selectedDish.category}</p>
              <p><strong>Match Score:</strong> {Math.round((selectedDish.scores?.total || 0) * 100)}%</p>
            </div>
            <div className="modal-actions">
              <button className="btn-primary" onClick={handleAddToCart}>
                Add to Cart
              </button>
              <button className="btn-secondary" onClick={closeModal}>
                Spin Again
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpinWheel;
