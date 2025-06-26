const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const authenticate = require("../middleware/authMiddleware");

router.post("/", authenticate, reviewController.createReview);
router.get("/user/:id", reviewController.getUserReviews);

module.exports = router;