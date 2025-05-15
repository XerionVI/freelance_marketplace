const express = require("express");
const router = express.Router();
const voteController = require("../controllers/voteController");
const auth = require("../middleware/authMiddleware"); // If you use authentication

router.post("/mark-voteable", auth, voteController.markJobAsVoteable);
router.get("/voteable-jobs", voteController.getVoteableJobs);
router.post("/vote", auth, voteController.voteForDispute);
router.get("/user-votes", auth, voteController.getUserVotes);
router.get("/vote-counts/:disputeId", voteController.getVoteCounts);

module.exports = router;