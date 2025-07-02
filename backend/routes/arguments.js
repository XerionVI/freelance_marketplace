const express = require("express");
const router = express.Router();
const agumentsController = require("../controllers/argumentsController");
const authMiddleware = require("../middleware/authMiddleware");

// Add argument
router.post("/add", authMiddleware, agumentsController.addArgument);

// Get all arguments for a dispute
router.get("/dispute/:disputeId", authMiddleware, agumentsController.getArgumentsByDispute);

module.exports = router;