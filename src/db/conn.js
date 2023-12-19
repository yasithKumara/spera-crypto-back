// db.js

const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');

// // Connection URI
// const uri = 'mongodb+srv://yasithkumara:Sp6vqRXfhbBy37tO@yasithcluster0.vauv2ub.mongodb.net/spera';

async function connectToDatabase() {
  try {

    console.log("uri is", process.env.ATLAS_URI)

    await mongoose.connect(process.env.ATLAS_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    // || "mongodb+srv://yasithkumara:Sp6vqRXfhbBy37tO@yasithcluster0.vauv2ub.mongodb.net/spera"
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