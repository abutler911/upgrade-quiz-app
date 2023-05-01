const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { isLoggedIn, isAdmin } = require("../middleware/middlewares");

router.get("/awaiting-approval", (req, res) => {
  res.render("./awaiting-approval");
});

router.get(
  "/admin/users-awaiting-approval",
  isLoggedIn,
  isAdmin,
  async (req, res) => {
    try {
      const users = await User.find({ status: "pending" });
      res.render("admin/users-awaiting-approval", { users });
    } catch (err) {
      console.log(err);
      res.status(500).send("Error fetching users");
    }
  }
);

router.post(
  "/admin/approve-user/:userId",
  isLoggedIn,
  isAdmin,
  async (req, res) => {
    try {
      await User.findByIdAndUpdate(req.params.userId, { status: "approved" });
      res.redirect("/admin/users-awaiting-approval");
    } catch (err) {
      console.log(err);
      res.status(500).send("Error updating user status");
    }
  }
);

router.post(
  "/admin/delete-user/:userId",
  isLoggedIn,
  isAdmin,
  async (req, res) => {
    try {
      await User.findByIdAndDelete(req.params.userId);
      res.redirect("/admin/users-awaiting-approval");
    } catch (err) {
      console.log(err);
      res.status(500).send("Error deleting user");
    }
  }
);

module.exports = router;
