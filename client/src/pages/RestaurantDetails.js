// client/src/pages/RestaurantDetails.js
// Restaurant details and menu page

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';

const RestaurantDetails = () => {
  const { id } = useParams();
  const { addToCart, cart } = useCart();
  
  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [vegOnly, setVegOnly] = useState(false);

  useEffect(() => {
    fetchRestaurantAndMenu();
  }, [id]);

  const fetchRestaurantAndMenu = async () => {
    try {
      setLoading(true);
      const [restaurantRes, menuRes] = await Promise.all([
        api.get(`/restaurants/${id}`),
        api.get(`/restaurants/${id}/menu`)
      ]);
      setRestaurant(restaurantRes.data);
      setMenu(menuRes.data);
    } catch (error) {
      console.error('Error fetching restaurant:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['all', 'breakfast', 'lunch', 'dinner', 'snacks', 'beverages', 'desserts'];

  const filteredMenu = menu.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesVeg = !vegOnly || item.veg;
    return matchesCategory && matchesVeg;
  });

  const handleAddToCart = (item) => {
    addToCart(item, {
      _id: restaurant._id,
      name: restaurant.name,
      location: restaurant.location
    });
  };

  const isInCart = (itemId) => {
    return cart.some(item => item._id === itemId);
  };

  if (loading) {
    return <div className="loading-spinner">Loading restaurant...</div>;
  }

  if (!restaurant) {
    return <div className="error-message">Restaurant not found</div>;
  }

  return (
    <div className="restaurant-details-page">
      <div className="restaurant-hero">
        <img 
          src={restaurant.imageUrl || 'https://via.placeholder.com/800x300?text=Restaurant'} 
          alt={restaurant.name}
          className="hero-image"
        />
        <div className="hero-overlay">
          <h1>{restaurant.name}</h1>
          <p className="cuisines">{restaurant.cuisines?.join(', ')}</p>
          <div className="restaurant-info">
            <span>⭐ {restaurant.rating?.toFixed(1)}</span>
            <span>⏱ {restaurant.deliveryTime}</span>
            <span>₹{restaurant.deliveryFee} Delivery</span>
          </div>
          <p className="location">📍 {restaurant.location}</p>
        </div>
      </div>

      <div className="menu-filters">
        <div className="category-tabs">
          {categories.map(cat => (
            <button
              key={cat}
              className={`category-tab ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
        
        <label className="veg-filter">
          <input
            type="checkbox"
            checked={vegOnly}
            onChange={(e) => setVegOnly(e.target.checked)}
          />
          Veg Only
        </label>
      </div>

      <div className="menu-section">
        <h2>Menu</h2>
        {filteredMenu.length === 0 ? (
          <p className="no-menu">No items available in this category</p>
        ) : (
          <div className="menu-grid">
            {filteredMenu.map(item => (
              <div key={item._id} className="menu-item">
                <img 
                  src={item.imageUrl || 'https://via.placeholder.com/150x150?text=Dish'} 
                  alt={item.name}
                />
                <div className="menu-item-info">
                  <div className="menu-item-header">
                    <h3>{item.name}</h3>
                    {item.veg ? (
                      <span className="veg-indicator">🟢</span>
                    ) : (
                      <span className="non-veg-indicator">🔴</span>
                    )}
                  </div>
                  <p className="menu-item-desc">{item.description || ''}</p>
                  <div className="menu-item-footer">
                    <span className="price">₹{item.price}</span>
                    <button
                      className={`add-btn ${isInCart(item._id) ? 'in-cart' : ''}`}
                      onClick={() => handleAddToCart(item)}
                      disabled={!item.available}
                    >
                      {isInCart(item._id) ? 'Added ✓' : item.available ? 'Add +' : 'Unavailable'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantDetails;
