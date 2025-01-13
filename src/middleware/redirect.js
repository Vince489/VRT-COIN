function redirectIfLoggedIn(req, res, next) {
    if (req.session && req.session.userId) {
      return res.redirect('/profile'); // Redirect to profile if logged in
    }
    next(); // Proceed to the page if not logged in
  }

  module.exports = redirectIfLoggedIn;