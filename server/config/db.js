// server/config/db.js
// Database connection configuration

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;

    if (typeof mongoUri !== 'string' || !mongoUri.trim()) {
      throw new Error('MongoDB URI is missing. Set MONGODB_URI (or MONGO_URI) in your environment.');
    }

    const conn = await mongoose.connect(mongoUri.trim(), {});
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
