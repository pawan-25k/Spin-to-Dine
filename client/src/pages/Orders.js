// client/src/pages/Orders.js
// Order history page

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Orders = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchOrders();
  }, [isAuthenticated, navigate]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get('/orders');
      setOrders(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      placed: '#3498db',
      confirmed: '#9b59b6',
      preparing: '#f39c12',
      out_for_delivery: '#e67e22',
      delivered: '#27ae60',
      cancelled: '#e74c3c'
    };
    return colors[status] || '#95a5a6';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <div className="loading-spinner">Loading orders...</div>;
  }

  if (error) {
    return (
      <div className="orders-page">
        <div className="error-message">{error}</div>
        <button onClick={fetchOrders} className="btn-primary">Try Again</button>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <h1>My Orders</h1>
      
      {orders.length === 0 ? (
        <div className="no-orders">
          <h2>No orders yet</h2>
          <p>Start exploring and order your favorite food!</p>
          <Link to="/" className="btn-primary">Browse Restaurants</Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <div>
                  <h3>{order.restaurantName}</h3>
                  <p className="order-date">{formatDate(order.orderedAt)}</p>
                </div>
                <div 
                  className="order-status"
                  style={{ backgroundColor: getStatusColor(order.deliveryStatus) }}
                >
                  {order.deliveryStatus.replace(/_/g, ' ').toUpperCase()}
                </div>
              </div>
              
              <div className="order-items">
                {order.items.map((item, index) => (
                  <span key={index} className="order-item">
                    {item.name} x {item.quantity}
                  </span>
                ))}
              </div>
              
              <div className="order-footer">
                <span className="order-total">Total: ₹{order.totalAmount}</span>
                <span className="payment-method">
                  Payment: {order.paymentMethod === 'cash' ? 'Cash on Delivery' : order.paymentMethod}
                </span>
              </div>
              
              <div className="order-address">
                📍 {order.deliveryAddress}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
