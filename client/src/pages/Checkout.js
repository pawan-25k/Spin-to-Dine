// client/src/pages/Checkout.js
// Checkout page for placing orders

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Checkout = () => {
  const { cart, restaurant, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const deliveryFee = restaurant?.deliveryFee || 0;
  const total = getCartTotal() + deliveryFee;

  const handlePlaceOrder = async () => {
    if (cart.length === 0) return;

    setLoading(true);
    setError(null);

    try {
      const orderData = {
        items: cart.map(item => ({
          menuItemId: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        totalAmount: total,
        deliveryFee: deliveryFee,
        deliveryAddress: user?.address || 'Default address',
        paymentMethod: 'cash',
        restaurantId: restaurant._id,
        restaurantName: restaurant.name
      };

      const response = await api.post('/orders', orderData);
      
      setOrderId(response.data._id);
      setOrderPlaced(true);
      clearCart();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="checkout-page">
        <div className="order-success">
          <div className="success-icon">✓</div>
          <h1>Order Placed Successfully!</h1>
          <p>Your order ID is: <strong>{orderId}</strong></p>
          <p>We'll notify you when your order is confirmed.</p>
          <div className="success-actions">
            <button onClick={() => navigate('/orders')} className="btn-primary">
              View Orders
            </button>
            <button onClick={() => navigate('/')} className="btn-secondary">
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="checkout-page">
        <div className="empty-cart">
          <h2>Your cart is empty</h2>
          <button onClick={() => navigate('/')} className="btn-primary">
            Browse Restaurants
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>
      
      <div className="checkout-container">
        <div className="checkout-form">
          <h2>Delivery Details</h2>
          <div className="delivery-address">
            <p><strong>Deliver to:</strong></p>
            <p>{user?.name}</p>
            <p>{user?.address || 'No address provided'}</p>
          </div>
          
          <div className="payment-method">
            <h3>Payment Method</h3>
            <label className="payment-option">
              <input type="radio" name="payment" value="cash" defaultChecked />
              <span>Cash on Delivery</span>
            </label>
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <button 
            onClick={handlePlaceOrder} 
            className="btn-primary btn-full"
            disabled={loading}
          >
            {loading ? 'Placing Order...' : `Place Order - ₹${total}`}
          </button>
        </div>
        
        <div className="order-summary">
          <h2>Order Summary</h2>
          <div className="restaurant-name">{restaurant?.name}</div>
          
          {cart.map(item => (
            <div key={item._id} className="summary-item">
              <span>{item.name} x {item.quantity}</span>
              <span>₹{item.price * item.quantity}</span>
            </div>
          ))}
          
          <div className="summary-divider"></div>
          
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
        </div>
      </div>
    </div>
  );
};

export default Checkout;
