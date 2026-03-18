// client/src/components/RestaurantCard.js
// Restaurant card component for displaying restaurant info

import React from 'react';
import { Link } from 'react-router-dom';

const RestaurantCard = ({ restaurant }) => {
  const {
    _id,
    name,
    location,
    rating,
    cuisines,
    deliveryTime,
    deliveryFee,
    imageUrl,
    vegOnly
  } = restaurant;

  return (
    <Link to={`/restaurant/${_id}`} className="restaurant-card">
      <div className="restaurant-image">
        <img 
          src={imageUrl || 'https://via.placeholder.com/300x200?text=Restaurant'} 
          alt={name} 
        />
        {vegOnly && <span className="veg-badge">Pure Veg</span>}
      </div>
      
      <div className="restaurant-info">
        <div className="restaurant-header">
          <h3 className="restaurant-name">{name}</h3>
          <div className="restaurant-rating">
            <span className="rating-star">⭐</span>
            <span className="rating-value">{rating?.toFixed(1) || '0.0'}</span>
          </div>
        </div>
        
        <p className="restaurant-cuisines">{cuisines?.join(', ')}</p>
        
        <div className="restaurant-meta">
          <span className="delivery-time">⏱ {deliveryTime}</span>
          <span className="delivery-fee">
            {deliveryFee === 0 ? 'Free Delivery' : `₹${deliveryFee} Delivery`}
          </span>
        </div>
        
        <p className="restaurant-location">📍 {location}</p>
      </div>
    </Link>
  );
};

export default RestaurantCard;
