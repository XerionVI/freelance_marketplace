const express = require("express");
const disputeController = require("../controllers/disputeController");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

// Create a new dispute
router.post("/", auth, disputeController.createDispute);

// Get all disputes
router.get("/", auth, disputeController.getAllDisputes);

// Get a dispute by contractJobId (for a job)
router.get("/job/:contractJobId", auth, disputeController.getDisputeByContractJobId);

// Get all voteable disputes
router.get("/voteable", disputeController.getVoteableDisputes);

// (Optional) Get all disputes for a user   
router.get("/user", auth, disputeController.getUserDisputes);

// (Optional) Get a dispute by its disputeId
router.get("/:disputeId", auth, disputeController.getDisputeById);

// Get a dispute by its disputeId
router.post("/enable-voting/:disputeId", disputeController.enableVoting);

// Mark a dispute as resolved
router.patch("/mark-resolved/:disputeId", disputeController.markDisputeResolved);

// Update arguments for a dispute
router.patch("/arguments/:disputeId", disputeController.updateDisputeArguments);

module.exports = router;