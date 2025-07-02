// filepath: d:\Project TA\freelance_marketplace\backend\routes\auth.js
const express = require("express");
const { check } = require("express-validator");
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// User registration
router.post(
  "/register",
  [
    check("username", "Username is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password must be 6 or more characters").isLength({ min: 6 }),
  ],
  authController.register
);

// User login
router.post(
  "/login",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  authController.login
);
router.get("/me", authMiddleware, authController.getMe);

module.exports = router;