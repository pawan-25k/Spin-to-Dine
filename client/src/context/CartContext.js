// client/src/context/CartContext.js
// Cart context for managing shopping cart state

import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [restaurant, setRestaurant] = useState(null);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item, restaurantInfo) => {
    // If cart has items from different restaurant, clear it first
    if (restaurant && restaurant._id !== restaurantInfo._id) {
      if (window.confirm('Your cart contains items from another restaurant. Clear and add this instead?')) {
        setCart([{ ...item, cartId: Date.now() }]);
        setRestaurant(restaurantInfo);
      }
      return;
    }

    setRestaurant(restaurantInfo);

    setCart(prevCart => {
      const existingItem = prevCart.find(i => i._id === item._id);
      if (existingItem) {
        return prevCart.map(i => 
          i._id === item._id 
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prevCart, { ...item, quantity: 1, cartId: Date.now() }];
    });
  };

  const removeFromCart = (itemId) => {
    setCart(prevCart => prevCart.filter(item => item._id !== itemId));
    
    // Clear restaurant if cart is empty
    if (cart.length === 1) {
      setRestaurant(null);
    }
  };

  const updateQuantity = (itemId, quantity) => {
    if (quantity < 1) {
      removeFromCart(itemId);
      return;
    }

    setCart(prevCart => 
      prevCart.map(item => 
        item._id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    setRestaurant(null);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const value = {
    cart,
    restaurant,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
