const express = require("express");
const router = express.Router();
const disputeController = require("../controllers/disputeController");
const auth = require("../middleware/authMiddleware");

// Create a new dispute
router.post("/", auth, disputeController.createDispute);

// Get all disputes
router.get("/", auth, disputeController.getAllDisputes);

// Get a dispute by contractJobId (for a job)
router.get("/job/:contractJobId", auth, disputeController.getDisputeByContractJobId);

// (Optional) Get all disputes for a user
router.get("/user", auth, disputeController.getUserDisputes);

// (Optional) Get a dispute by its disputeId
router.get("/:disputeId", auth, disputeController.getDisputeById);

// Get all voteable disputes
router.get("/voteable", disputeController.getVoteableDisputes);

// Get a dispute by its disputeId
router.post("/enable-voting/:disputeId", disputeController.enableVoting);

module.exports = router;