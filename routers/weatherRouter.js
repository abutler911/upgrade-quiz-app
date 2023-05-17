const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middleware/middlewares");
const weatherData = require("../public/data/weather");

router.get("/weather", isLoggedIn, (req, res) => {
  res.render("weather", {
    weatherData,
    title: "Weather",
    customCSS: "weather.css",
  });
});

module.exports = router;
