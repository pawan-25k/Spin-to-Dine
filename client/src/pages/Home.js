// client/src/pages/Home.js
// Home page with restaurant listings

import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import RestaurantCard from '../components/RestaurantCard';

const DEFAULT_FILTERS = {
  search: '',
  rating: '',
  veg: false
};

const Home = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const fetchRestaurants = useCallback(async (activeFilters) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (activeFilters.search) params.append('search', activeFilters.search);
      if (activeFilters.rating) params.append('rating', activeFilters.rating);
      if (activeFilters.veg) params.append('veg', 'true');

      const response = await api.get(`/restaurants?${params.toString()}`);
      setRestaurants(response.data.restaurants || []);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRestaurants(DEFAULT_FILTERS);
  }, [fetchRestaurants]);

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchRestaurants(filters);
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

          <button onClick={() => fetchRestaurants(filters)} className="apply-filters-btn">
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
              const clearedFilters = { search: '', rating: '', veg: false };
              setFilters(clearedFilters);
              fetchRestaurants(clearedFilters);
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
