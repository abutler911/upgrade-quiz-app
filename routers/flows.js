const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middleware/middlewares");

router.get("/flows", isLoggedIn, (req, res) => {
  res.render("./flows");
});

module.exports = router;
