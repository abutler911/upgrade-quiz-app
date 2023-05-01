const express = require("express");
const router = express.Router();

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error("Error during logout:", err);
      return res.status(500).send("Error during logout");
    }
    res.redirect("/");
  });
});

module.exports = router;
