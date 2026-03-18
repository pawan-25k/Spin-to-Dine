// client/src/pages/Home.js
// Home page with restaurant listings

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import RestaurantCard from '../components/RestaurantCard';

const Home = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    rating: '',
    veg: false
  });

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.rating) params.append('rating', filters.rating);
      if (filters.veg) params.append('veg', 'true');

      const response = await api.get(`/restaurants?${params.toString()}`);
      setRestaurants(response.data.restaurants || []);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchRestaurants();
  };

  return (
    <div className="home-page">
      <div className="hero-section">
        <h1> Delicious Food, Delivered Fast</h1>
        <p>Order from your favorite restaurants</p>
        
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            name="search"
            placeholder="Search restaurants or cuisines..."
            value={filters.search}
            onChange={handleFilterChange}
            className="search-input"
          />
          <button type="submit" className="search-btn">Search</button>
        </form>
      </div>

      <div className="filters-section">
        <h3>Filter By:</h3>
        <div className="filters">
          <select 
            name="rating" 
            value={filters.rating} 
            onChange={handleFilterChange}
            className="filter-select"
          >
            <option value="">All Ratings</option>
            <option value="4">4+ Stars</option>
            <option value="3">3+ Stars</option>
            <option value="2">2+ Stars</option>
          </select>
          
          <label className="filter-checkbox">
            <input
              type="checkbox"
              name="veg"
              checked={filters.veg}
              onChange={handleFilterChange}
            />
            Veg Only
          </label>

          <button onClick={fetchRestaurants} className="apply-filters-btn">
            Apply Filters
          </button>
        </div>
      </div>

      <div className="restaurants-section">
        <h2>Restaurants Near You</h2>
        
        {loading ? (
          <div className="loading-spinner">Loading restaurants...</div>
        ) : restaurants.length === 0 ? (
          <div className="no-results">
            <p>No restaurants found</p>
            <button onClick={() => {
              setFilters({ search: '', rating: '', veg: false });
              fetchRestaurants();
            }} className="btn-secondary">
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="restaurants-grid">
            {restaurants.map(restaurant => (
              <RestaurantCard key={restaurant._id} restaurant={restaurant} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
