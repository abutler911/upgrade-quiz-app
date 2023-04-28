function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
    // } else {
    //   req.session.returnTo = req.originalUrl;
    //   res.redirect("/login");
  }
  res.status(403).send("You must be logged in.");

  res.redirect("/login");
}

function isAdmin(req, res, next) {
  if (req.isAuthenticated() && req.user.isAdmin) {
    return next();
  }
  // res.status(403).send("You do not have permission to access this page.");

  res.redirect("/login");
}

module.exports = {
  isLoggedIn,
  isAdmin,
};
