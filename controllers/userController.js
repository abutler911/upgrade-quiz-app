// controllers/userController.js
const crypto = require("crypto");
const User = require("../models/User");
const sgMail = require("@sendgrid/mail");
require("dotenv").config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.forgotPassword = (req, res) => {
  res.render("forgot-password", {
    title: "Forgot Password",
    customCSS: "forgot-password.css",
  });
};

exports.handleForgotPassword = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.redirect("/forgot-password");
  }

  const token = crypto.randomBytes(20).toString("hex");
  const expires = Date.now() + 3600000; // 1 hour

  user.resetPasswordToken = token;
  user.resetPasswordExpires = expires;
  await user.save();

  const msg = {
    to: user.email,
    from: "abutler911@gmail.com",
    subject: "Password Reset",
    text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.
Please click on the following link, or paste this into your browser to complete the process:
https://${req.headers.host}/reset-password/${token}

If you did not request this, please ignore this email and your password will remain unchanged.`,
  };

  sgMail.send(msg, (err) => {
    if (err) {
      console.error("Error sending email:", err);
      return res.redirect("/forgot-password");
    }
    res.redirect("/forgot-password");
  });
};

exports.resetPassword = async (req, res) => {
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res.redirect("/forgot-password");
  }

  res.render("reset-password", {
    title: "Reset Password",
    customCSS: "reset-password.css",
    token: req.params.token,
  });
};

exports.handleResetPassword = async (req, res) => {
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res.redirect("/forgot-password");
  }

  user.setPassword(req.body.password, async (err) => {
    if (err) {
      return res.redirect("/reset-password/" + req.params.token);
    }

    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    req.login(user, (err) => {
      if (err) {
        console.error(err);
      }
      res.redirect("/");
    });
  });
};
