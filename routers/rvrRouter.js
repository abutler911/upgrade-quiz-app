const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middleware/middlewares");

router.get("/rvr", isLoggedIn, (req, res) => {
  res.render("rvr", {
    title: "RVR Simulator",
    customCSS: "rvr.css",
  });
});

module.exports = router;
