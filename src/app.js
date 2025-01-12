// app.js

const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const connectToDB = require("./config/db");
const cookieParser = require("cookie-parser");
const path = require("path");
const routes = require("./routes");
const uiRoutes = require("./routes/uiRoutes");

const app = express();

// Session middleware setup with V4
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production", // true in production (https), false in development (http)
      maxAge: 1000 * 60 * 60 * 24, // 24 hours
    },
      store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI, // MongoDB connection URL
      collectionName: "sessions",        // Store session in "sessions" collection
    }),
  })
);

// Middleware for parsing URL-encoded form data and JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "public")));

// Set EJS as the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); // Path to your EJS templates

// Use express layouts
app.use(expressLayouts);
app.set("layout", "layouts/default");

// API Routes
app.use("/api/v1", routes);

// UI Routes 
app.use("/", uiRoutes); 

// Refresh the session on every request
app.use((req, res, next) => {
  if (req.session) {
    req.session.cookie.maxAge = 86400000; // 24 hours in milliseconds
  }
  next();
});

// Handle expired sessions
app.use((req, res, next) => {
  if (!req.session.userId) {
    // Session expired or user not logged in
    return res.redirect('/login'); // Redirect to login page
  }
  next(); // Continue with the request if session exists
});

// Default locals
app.use((req, res, next) => {
  res.locals.title = ""; // Default title
  res.locals.message = ""; // Default message
  next();
});


// Connect to the database
connectToDB();

// Handle 404 errors
app.use((req, res, next) => {
  res.status(404).render("404", { message: "Page not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render("error", { message: "Something went wrong" });
});

module.exports = app;
