const express = require("express");
const router = express.Router();
const sgMail = require("@sendgrid/mail");
const User = require("../models/User");

router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/register", (req, res) => {
  User.register(
    new User({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      employeeNumber: req.body.employeeNumber,
      username: req.body.username.toLowerCase(),
      status: "pending",
      iaAdmin: false,
    }),
    req.body.password,
    async (err, user) => {
      if (err) {
        console.log(err);
        return res.redirect("/register");
      }

      // Send email
      try {
        const msg = {
          to: req.body.email,
          from: "abutler911@gmail.com",
          subject: "Registration successful",
          text: `Dear ${req.body.firstname},\n\nYour registration was successful and is currently pending approval. Please check back in a day or two.\n\nBest regards,\nThe Upgrade Me Team`,
        };

        await sgMail.send(msg);
        console.log("Email sent");
      } catch (err) {
        console.error("Error sending email:", err);
      }

      res.redirect("/awaiting-approval");
    }
  );
});

module.exports = router;
