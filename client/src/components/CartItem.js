// client/src/components/CartItem.js
// Cart item component for displaying items in cart

import React from 'react';
import { useCart } from '../context/CartContext';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <div className="cart-item">
      <div className="cart-item-image">
        <img 
          src={item.imageUrl || 'https://via.placeholder.com/80x80?text=Dish'} 
          alt={item.name} 
        />
      </div>
      
      <div className="cart-item-details">
        <h4 className="cart-item-name">{item.name}</h4>
        <p className="cart-item-restaurant">
          {item.restaurantName || item.restaurant?.name}
        </p>
        <p className="cart-item-price">₹{item.price}</p>
      </div>
      
      <div className="cart-item-actions">
        <div className="quantity-controls">
          <button 
            onClick={() => updateQuantity(item._id, item.quantity - 1)}
            className="qty-btn"
          >
            −
          </button>
          <span className="qty-value">{item.quantity}</span>
          <button 
            onClick={() => updateQuantity(item._id, item.quantity + 1)}
            className="qty-btn"
          >
            +
          </button>
        </div>
        
        <button 
          onClick={() => removeFromCart(item._id)}
          className="remove-btn"
        >
          Remove
        </button>
      </div>
      
      <div className="cart-item-total">
        ₹{item.price * item.quantity}
      </div>
    </div>
  );
};

export default CartItem;
