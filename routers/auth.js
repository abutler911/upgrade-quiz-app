const express = require("express");
const router = express.Router();
const passport = require("passport");

router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/login", (req, res, next) => {
  req.body.username = req.body.username.toLowerCase();
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.redirect("/login");
    }
    if (user.status !== "approved") {
      return res.status(403).send("Your account is not approved yet.");
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }

      return res.redirect("/");
    });
  })(req, res, next);
});

module.exports = router;
