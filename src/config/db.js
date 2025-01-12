// src/config/db.js

require("dotenv").config();
const mongoose = require("mongoose");

const { MONGODB_URI } = process.env;

// Function to establish database connection
const connectToDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to Database");

    // Connection events for better monitoring
    mongoose.connection.on("connected", () => {
      console.log("Mongoose connected to the database");
    });

    mongoose.connection.on("error", (err) => {
      console.error("Mongoose connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("Mongoose disconnected from the database");
    });

    // Handle app termination gracefully
    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      console.log("Mongoose connection closed due to app termination");
      process.exit(0);
    });
  } catch (error) {
    console.error("Error connecting to database:", error);
    // Ensure the application exits if the database connection fails
    process.exit(1);
  }
};

module.exports = connectToDB;
