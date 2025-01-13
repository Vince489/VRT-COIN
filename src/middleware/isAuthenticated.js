// middleware/isAuthenticated.js

function isAuthenticated(req, res, next) {
  if (req.session && req.session.userId) {
    // User is authenticated, proceed to the next middleware or route handler
      return next();
    } else {
      // Redirect unauthenticated users to the login page with a query parameter
      return res.redirect('/login?error=not_authenticated');
    }
  }

 
  module.exports = isAuthenticated;
  