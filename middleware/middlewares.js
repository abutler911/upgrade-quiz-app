function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    return next(new Error("You must be logged in."));
  }
}

function isAdmin(req, res, next) {
  if (req.isAuthenticated()) {
    if (req.user.isAdmin) {
      return next();
    } else {
      return next(new Error("You do not have permission to access this page."));
    }
  } else {
    return next(new Error("You must be logged in."));
  }
}

module.exports = {
  isLoggedIn,
  isAdmin,
};
