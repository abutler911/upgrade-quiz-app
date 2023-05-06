const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middleware/middlewares");

router.get("/fuel", isLoggedIn, (req, res) => {
  res.render("fuel", { title: "Fuel Planning", customCSS: "fuel.css" });
});

module.exports = router;
