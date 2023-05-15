const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middleware/middlewares");

router.get("/weather", isLoggedIn, (req, res) => {
  res.render("weather", { title: "Weather", customCSS: "weather.css" });
});

module.exports = router;
