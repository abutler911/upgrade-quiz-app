// routers/passwordReset.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/forgot-password", userController.forgotPassword);
router.post("/forgot-password", userController.handleForgotPassword);
router.get("/reset-password/:token", userController.resetPassword);
router.post("/reset-password/:token", userController.handleResetPassword);

module.exports = router;
