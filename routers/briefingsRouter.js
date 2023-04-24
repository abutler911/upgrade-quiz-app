const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middleware/middlewares");

router.get("/briefings", isLoggedIn, (req, res) => {
  res.render("briefings");
});

module.exports = router;
