// db.js

const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');

async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.ATLAS_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error; // Rethrow the error to be caught by the calling function
  }
}

// Wrap the connectToDatabase function with express-async-handler
const asyncConnectToDatabase = asyncHandler(connectToDatabase);

// Export the asyncConnectToDatabase
module.exports = asyncConnectToDatabase;