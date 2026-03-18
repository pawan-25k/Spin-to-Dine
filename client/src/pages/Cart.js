// client/src/pages/Cart.js
// Shopping cart page

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import CartItem from '../components/CartItem';

const Cart = () => {
  const { cart, restaurant, getCartTotal, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const deliveryFee = restaurant?.deliveryFee || 0;
  const total = getCartTotal() + deliveryFee;

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };

  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <div className="empty-cart">
          <h2>🛒 Your cart is empty</h2>
          <p>Add some delicious food from our restaurants!</p>
          <Link to="/" className="btn-primary">Browse Restaurants</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>
      
      {restaurant && (
        <div className="cart-restaurant-info">
          <span>Order from:</span>
          <strong>{restaurant.name}</strong>
        </div>
      )}
      
      <div className="cart-items">
        {cart.map(item => (
          <CartItem key={item._id} item={item} />
        ))}
      </div>
      
      <div className="cart-summary">
        <h3>Order Summary</h3>
        <div className="summary-row">
          <span>Subtotal</span>
          <span>₹{getCartTotal()}</span>
        </div>
        <div className="summary-row">
          <span>Delivery Fee</span>
          <span>₹{deliveryFee}</span>
        </div>
        <div className="summary-row total">
          <span>Total</span>
          <span>₹{total}</span>
        </div>
        
        <div className="cart-actions">
          <button onClick={handleCheckout} className="btn-primary btn-full">
            Proceed to Checkout
          </button>
          <button onClick={clearCart} className="btn-secondary btn-full">
            Clear Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
