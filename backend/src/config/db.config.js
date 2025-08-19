const mongoose = require('mongoose');
const { MONGO_URI } = require('./env.config');

/**
 * Establishes a connection to MongoDB using Mongoose
 * @async
 * @function connectDB
 * @returns {Promise<void>} Resolves when connection is established
 * @throws {Error} If connection fails
 * 
 * @example
 * // In your server startup file
 * const connectDB = require('./config/dbConfig');
 * connectDB();
 * 
 * @description
 * - Uses connection string from environment variables
 * - Applies recommended Mongoose connection settings
 * - Handles connection errors gracefully
 * - Logs connection status
 */


const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,       // Use new URL parser
      useUnifiedTopology: true,    // Use new Server Discovery and Monitoring engine
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    
    // Connection event listeners
    mongoose.connection.on('connected', () => {
      console.log('Mongoose connected to DB');
    });

    mongoose.connection.on('error', (err) => {
      console.error(`Mongoose connection error: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('Mongoose connection disconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('Mongoose connection closed due to app termination');
      process.exit(0);
    });

  } catch (err) {
    console.error(`❌ MongoDB Connection Error: ${err.message}`);
    console.error('Exiting application...');
    process.exit(1); // Exit with failure
  }
};

module.exports = connectDB;