# 🍽️ Spin-to-Dine Wheel

A full-stack gamified food recommendation system that helps users decide what to eat using a fun spinning wheel. This project reduces decision fatigue and enhances user engagement in food ordering applications.

---

## 🚀 Features

- 🎡 Interactive Spin Wheel for food selection
- 🍛 Random / Intelligent food recommendation
- 📊 Backend recommendation logic
- 🗂️ Food database using MongoDB
- ⚡ Fast and responsive API with Express
- 🎯 Reduces decision-making time

---

## 🛠️ Tech Stack

### Frontend
- React.js
- CSS / Tailwind

### Backend
- Node.js
- Express.js

### Database
- MongoDB (Mongoose)

---

## 📁 Project Structure
 
 ```
Spin-to-Dine
│
├── server (Backend)
│   ├── config
│   │   └── db.js
│   │
│   ├── controllers
│   │   ├── authController.js
│   │   ├── orderController.js
│   │   ├── restaurantController.js
│   │   └── spinController.js
│   │
│   ├── middleware
│   │   ├── authMiddleware.js
│   │   └── errorMiddleware.js
│   │
│   ├── models
│   │   ├── User.js
│   │   ├── Restaurant.js
│   │   ├── Menu.js
│   │   ├── Order.js
│   │   └── GamificationLog.js
│   │
│   ├── routes
│   │   ├── authRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── restaurantRoutes.js
│   │   └── spinRoutes.js
│   │
│   ├── utils
│   │   └── recommendationEngine.js
│   │
│   ├── seed.js
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── client (Frontend)
│   ├── public
│   │
│   ├── src
│   │   ├── components
│   │   │   ├── Navbar.js
│   │   │   ├── SpinWheel.js
│   │   │   ├── RestaurantCard.js
│   │   │   └── CartItem.js
│   │   │
│   │   ├── context
│   │   │   ├── AuthContext.js
│   │   │   └── CartContext.js
│   │   │
│   │   ├── pages
│   │   │   ├── Home.js
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Cart.js
│   │   │   ├── Checkout.js
│   │   │   ├── Orders.js
│   │   │   └── RestaurantDetails.js
│   │   │
│   │   ├── services
│   │   │   ├── api.js
│   │   │   └── spinService.js
│   │   │
│   │   ├── styles
│   │   │   ├── home.css
│   │   │   ├── navbar.css
│   │   │   └── spinwheel.css
│   │   │
│   │   ├── App.js
│   │   └── index.js
│   │
│   ├── package.json
│
├── README.md
└── .gitignore
```


---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```
git clone https://github.com/vikkukrr/Spin-to-Dine

cd Spin-to-Dine
```
---

### 2️⃣ Install Dependencies

```
npm install
```
---

### 3️⃣ Setup Environment Variables
```
Create a '.env' file in root directory

MONGO_URI=mongodb://localhost:27017/Gamification
PORT=5000
```
---

### 4️⃣ Run the Backend

```
cd server
npm Start
```
### 5️⃣ Run the Frontend

```
cd client
npm Start
```

---

## 🧠 How It Works

1. User clicks the **Spin Wheel**
2. Backend fetches food data
3. Recommendation logic selects a food item
4. Result is sent to frontend
5. User can proceed to order

---

## 🔮 Future Improvements

- 🎯 Personalized recommendations (AI/ML)
- 💰 Budget-based filtering
- 📍 Location-based suggestions
- 👤 User authentication
- 📱 Mobile app version

---

## 🎯 Use Case

This project is useful for:
- Reducing user decision fatigue
- Improving engagement in food apps
- Demonstrating gamification in UI/UX

---

## 👨‍💻 Author

**Pawan Kumar** --[@pawan-25k]

**Vikram Kumar Paswan** --[@vikkukrr]

---

## ⭐ Contribute

Feel free to fork this repository and improve it!
