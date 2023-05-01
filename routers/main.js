const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("index", { title: "UpgradeMe | 2023", customCSS: "main.css" });
});

module.exports = router;
