const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Question = require("../models/Question");
const { isLoggedIn, isAdmin } = require("../middleware/middlewares");

router.get("/admin/dashboard", isLoggedIn, isAdmin, (req, res) => {
  res.render("admin/dashboard", {
    title: "Admin Dashboard",
    customCSS: "admin.css",
  });
});

router.get("/awaiting-approval", (req, res) => {
  res.render("./awaiting-approval", {
    title: "Users To Approve",
    customCSS: "admin.css",
  });
});

router.get(
  "/admin/users-awaiting-approval",
  isLoggedIn,
  isAdmin,
  async (req, res) => {
    try {
      const users = await User.find({ status: "pending" });
      res.render("admin/users-awaiting-approval", {
        title: "Users to Approve",
        customCSS: "admin.css",
        users,
      });
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

router.get(
  "/admin/flagged-questions",
  isLoggedIn,
  isAdmin,
  async (req, res) => {
    try {
      const questions = await Question.find({ flaggedForReview: true });
      res.render("admin/flagged-questions", {
        title: "Flagged Questions",
        customCSS: "admin.css",
        questions,
      });
    } catch (err) {
      console.log(err);
      res.status(500).send("Error fetching flagged questions");
    }
  }
);

router.post(
  "/admin/unflag-question/:questionId",
  isLoggedIn,
  isAdmin,
  async (req, res) => {
    try {
      await Question.findByIdAndUpdate(req.params.questionId, {
        flaggedForReview: false,
      });
      res.redirect("/admin/flagged-questions");
    } catch (err) {
      console.log(err);
      res.status(500).send("Error updating question status");
    }
  }
);

module.exports = router;
