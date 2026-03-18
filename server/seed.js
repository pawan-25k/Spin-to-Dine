// server/seed.js
// Seed data for testing the application

const mongoose = require('mongoose');
require('dotenv').config();

const Restaurant = require('./models/Restaurant');
const Menu = require('./models/Menu');

const restaurants = [
  {
    name: 'Biryani House',
    location: 'Downtown',
    rating: 4.5,
    ratingCount: 230,
    cuisines: ['Biryani', 'North Indian', 'Mughlai'],
    deliveryTime: '30-40 min',
    deliveryFee: 40,
    minOrder: 200,
    vegOnly: false,
    isOpen: true,
    imageUrl: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400'
  },
  {
    name: 'Green Leaf Kitchen',
    location: 'Westside',
    rating: 4.3,
    ratingCount: 180,
    cuisines: ['South Indian', 'Vegetarian', 'Healthy'],
    deliveryTime: '25-35 min',
    deliveryFee: 30,
    minOrder: 150,
    vegOnly: true,
    isOpen: true,
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400'
  },
  {
    name: 'Pizza Paradise',
    location: 'Central',
    rating: 4.7,
    ratingCount: 450,
    cuisines: ['Pizza', 'Italian', 'Fast Food'],
    deliveryTime: '20-30 min',
    deliveryFee: 50,
    minOrder: 300,
    vegOnly: false,
    isOpen: true,
    imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400'
  },
  {
    name: 'Spice Garden',
    location: 'Eastside',
    rating: 4.2,
    ratingCount: 150,
    cuisines: ['Chinese', 'Thai', 'Asian'],
    deliveryTime: '35-45 min',
    deliveryFee: 35,
    minOrder: 200,
    vegOnly: false,
    isOpen: true,
    imageUrl: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400'
  },
  {
    name: 'Southern Spice',
    location: 'Southtown',
    rating: 4.4,
    ratingCount: 200,
    cuisines: ['South Indian', 'Dosa', 'Idli'],
    deliveryTime: '25-35 min',
    deliveryFee: 25,
    minOrder: 100,
    vegOnly: false,
    isOpen: true,
    imageUrl: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400'
  },
  {
    name: 'Burger Barn',
    location: 'Central',
    rating: 4.1,
    ratingCount: 320,
    cuisines: ['Burgers', 'American', 'Fast Food'],
    deliveryTime: '20-30 min',
    deliveryFee: 40,
    minOrder: 150,
    vegOnly: false,
    isOpen: true,
    imageUrl: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400'
  }
];

const menuItems = [
  // Biryani House Menu
  {
    name: 'Chicken Dum Biryani',
    description: 'Aromatic basmati rice cooked with spicy chicken and traditional spices',
    price: 250,
    category: 'lunch',
    veg: false,
    restaurantIndex: 0,
    popularity: 150
  },
  {
    name: 'Mutton Biryani',
    description: 'Tender mutton pieces cooked with fragrant rice',
    price: 350,
    category: 'lunch',
    veg: false,
    restaurantIndex: 0,
    popularity: 120
  },
  {
    name: 'Vegetable Biryani',
    description: 'Mixed vegetables cooked with basmati rice and spices',
    price: 180,
    category: 'lunch',
    veg: true,
    restaurantIndex: 0,
    popularity: 80
  },
  {
    name: 'Chicken 65',
    description: 'Spicy deep-fried chicken appetizer',
    price: 200,
    category: 'snacks',
    veg: false,
    restaurantIndex: 0,
    popularity: 90
  },
  {
    name: 'Dal Makhani',
    description: 'Creamy black lentil curry',
    price: 150,
    category: 'lunch',
    veg: true,
    restaurantIndex: 0,
    popularity: 70
  },
  // Green Leaf Kitchen Menu
  {
    name: 'Masala Dosa',
    description: 'Crispy rice crepe with potato filling',
    price: 120,
    category: 'breakfast',
    veg: true,
    restaurantIndex: 1,
    popularity: 200
  },
  {
    name: 'Idli Sambar',
    description: 'Steamed rice cakes with lentil stew',
    price: 80,
    category: 'breakfast',
    veg: true,
    restaurantIndex: 1,
    popularity: 180
  },
  {
    name: 'Vegetable Uttapam',
    description: 'Thick pancake with vegetables',
    price: 140,
    category: 'breakfast',
    veg: true,
    restaurantIndex: 1,
    popularity: 100
  },
  {
    name: 'Paneer Tikka',
    description: 'Grilled cottage cheese with spices',
    price: 220,
    category: 'lunch',
    veg: true,
    restaurantIndex: 1,
    popularity: 150
  },
  {
    name: 'Fresh Fruit Juice',
    description: 'Seasonal mixed fruit juice',
    price: 60,
    category: 'beverages',
    veg: true,
    restaurantIndex: 1,
    popularity: 80
  },
  // Pizza Paradise Menu
  {
    name: 'Margherita Pizza',
    description: 'Classic tomato and mozzarella pizza',
    price: 299,
    category: 'lunch',
    veg: true,
    restaurantIndex: 2,
    popularity: 250
  },
  {
    name: 'Pepperoni Pizza',
    description: 'Loaded with pepperoni slices',
    price: 399,
    category: 'lunch',
    veg: false,
    restaurantIndex: 2,
    popularity: 220
  },
  {
    name: 'Veggie Supreme',
    description: 'Loaded with various vegetables',
    price: 349,
    category: 'lunch',
    veg: true,
    restaurantIndex: 2,
    popularity: 180
  },
  {
    name: 'Garlic Bread',
    description: 'Crispy bread with garlic butter',
    price: 99,
    category: 'snacks',
    veg: true,
    restaurantIndex: 2,
    popularity: 120
  },
  {
    name: 'Chocolate Lava Cake',
    description: 'Warm chocolate cake with molten center',
    price: 149,
    category: 'desserts',
    veg: true,
    restaurantIndex: 2,
    popularity: 200
  },
  // Spice Garden Menu
  {
    name: 'Chicken Fried Rice',
    description: 'Wok-tossed rice with chicken and vegetables',
    price: 200,
    category: 'lunch',
    veg: false,
    restaurantIndex: 3,
    popularity: 170
  },
  {
    name: 'Vegetable Noodles',
    description: 'Stir-fried noodles with vegetables',
    price: 150,
    category: 'lunch',
    veg: true,
    restaurantIndex: 3,
    popularity: 140
  },
  {
    name: 'Spring Rolls',
    description: 'Crispy vegetable rolls',
    price: 120,
    category: 'snacks',
    veg: true,
    restaurantIndex: 3,
    popularity: 100
  },
  {
    name: 'Manchurian',
    description: 'Fried balls in spicy sauce',
    price: 180,
    category: 'snacks',
    veg: true,
    restaurantIndex: 3,
    popularity: 160
  },
  // Southern Spice Menu
  {
    name: 'Chicken Chettinad',
    description: 'Spicy chicken curry with Chettinad spices',
    price: 280,
    category: 'lunch',
    veg: false,
    restaurantIndex: 4,
    popularity: 130
  },
  {
    name: 'Fish Fry',
    description: 'Crispy fried fish with spices',
    price: 250,
    category: 'lunch',
    veg: false,
    restaurantIndex: 4,
    popularity: 110
  },
  {
    name: 'Pongal',
    description: 'Rice and lentil dish with pepper',
    price: 100,
    category: 'breakfast',
    veg: true,
    restaurantIndex: 4,
    popularity: 90
  },
  {
    name: 'Chicken 65',
    description: 'Spicy fried chicken',
    price: 180,
    category: 'snacks',
    veg: false,
    restaurantIndex: 4,
    popularity: 140
  },
  // Burger Barn Menu
  {
    name: 'Classic Cheese Burger',
    description: 'Beef patty with cheese and veggies',
    price: 199,
    category: 'lunch',
    veg: false,
    restaurantIndex: 5,
    popularity: 200
  },
  {
    name: 'Veggie Burger',
    description: 'Plant-based patty with fresh vegetables',
    price: 169,
    category: 'lunch',
    veg: true,
    restaurantIndex: 5,
    popularity: 150
  },
  {
    name: 'Chicken Wings',
    description: 'Crispy fried chicken wings',
    price: 249,
    category: 'snacks',
    veg: false,
    restaurantIndex: 5,
    popularity: 180
  },
  {
    name: 'Onion Rings',
    description: 'Crispy battered onion rings',
    price: 99,
    category: 'snacks',
    veg: true,
    restaurantIndex: 5,
    popularity: 120
  },
  {
    name: 'Milkshake',
    description: 'Creamy vanilla milkshake',
    price: 129,
    category: 'beverages',
    veg: true,
    restaurantIndex: 5,
    popularity: 100
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Restaurant.deleteMany({});
    await Menu.deleteMany({});
    console.log('Cleared existing data');

    // Insert restaurants
    const createdRestaurants = await Restaurant.insertMany(restaurants);
    console.log(`Created ${createdRestaurants.length} restaurants`);

    // Insert menu items with correct restaurant references
    const menuItemsToInsert = menuItems.map(item => ({
      ...item,
      restaurantId: createdRestaurants[item.restaurantIndex]._id
    }));
    
    // Remove restaurantIndex from the objects
    menuItemsToInsert.forEach(item => delete item.restaurantIndex);

    await Menu.insertMany(menuItemsToInsert);
    console.log(`Created ${menuItemsToInsert.length} menu items`);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
