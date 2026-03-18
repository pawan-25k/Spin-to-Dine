# Spin-to-Dine Food Delivery Application

A full-stack MERN food delivery web application similar to Swiggy, featuring intelligent gamification with a smart spin-to-dine recommendation engine.

## Features

- **User Authentication** - Register, Login, JWT-based auth, Protected routes
- **Restaurant Browsing** - List restaurants, filter by rating/veg/price, search
- **Restaurant Details** - View menu, add items to cart
- **Shopping Cart** - Add/remove items, quantity control, dynamic pricing
- **Order System** - Place orders (Cash on Delivery), view order history, track delivery status
- **Spin-to-Dine Gamification** - Intelligent recommendation engine that suggests dishes based on:
  - User's past order frequency (40% weight)
  - Time of day - breakfast/lunch/dinner (20% weight)
  - Location trends (20% weight)
  - Budget match (20% weight)
  - Limited to 3 spins per day

## Tech Stack

### Frontend
- React.js (Functional Components + Hooks)
- React Router DOM
- Axios
- CSS3 (separate files)

### Backend
- Node.js
- Express.js
- REST API
- JWT Authentication
- bcrypt password hashing

### Database
- MongoDB with Mongoose

## Project Structure

```
/server
  /config        - Database configuration
  /controllers   - Route controllers
  /middleware    - Auth & error middleware
  /models        - Mongoose models
  /routes        - API routes
  /utils         - Utility functions (recommendation engine)
  server.js      - Main server file
  .env           - Environment variables

/client
  /public        - Static files
  /src
    /components  - React components
    /context     - Auth & Cart contexts
    /pages       - Page components
    /services    - API services
    /styles      - CSS files
    App.js       - Main app component
    index.js     - Entry point
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)

### Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create .env file in server directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/fooddelivery
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRE=7d
NODE_ENV=development
```

4. Start MongoDB (if running locally)

5. (Optional) Seed the database with sample data:
```bash
node seed.js
```

6. Start the backend server:
```bash
npm start
```

The server will run on http://localhost:5000

### Frontend Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will open at http://localhost:3000

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update profile (protected)

### Restaurants
- `GET /api/restaurants` - List restaurants (with filters)
- `GET /api/restaurants/:id` - Get restaurant details
- `GET /api/restaurants/:id/menu` - Get restaurant menu
- `GET /api/restaurants/menu/all` - Get all menu items
- `GET /api/restaurants/popular-dishes` - Get popular dishes

### Orders
- `POST /api/orders` - Create order (protected)
- `GET /api/orders` - Get user orders (protected)
- `GET /api/orders/:id` - Get order details (protected)
- `PUT /api/orders/:id/cancel` - Cancel order (protected)

### Spin-to-Dine (Gamification)
- `GET /api/spin/:userId` - Get smart suggestions (protected)
- `POST /api/spin/log` - Log spin result (protected)
- `GET /api/spin/history/:userId` - Get spin history (protected)

## Recommendation Engine Algorithm

The smart recommendation system uses a weighted scoring formula:

```
Score = (PastOrderFrequency × 0.4) + (TimeMatch × 0.2) + (LocationTrend × 0.2) + (BudgetMatch × 0.2)
```

- **Past Order Frequency (40%)**: Based on user's order history - orders for the same dish increase score
- **Time Match (20%)**: Suggests dishes appropriate for the time of day (breakfast items in morning, dinner items in evening)
- **Location Trend (20%)**: Uses restaurant ratings as a proxy for location-based popularity
- **Budget Match (20%)**: Recommends dishes within user's specified budget range

## Sample User Credentials

After running the seed script, you can register a new account or test with any email/password combination.

## Security Features

- bcrypt password hashing
- JWT authentication with middleware protection
- CORS enabled
- Error handling middleware
- Input validation

## Screenshots

The application features:
- Modern orange + white Swiggy-inspired design
- Responsive card layout for restaurants
- Interactive spin wheel with animations
- Smooth hover effects and transitions

## License

MIT License
