const express = require("express");
const jobController = require("../controllers/jobController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Fetch all jobs for the logged-in wallet address
router.get("/", authMiddleware, jobController.getJobs);

// Fetch a specific job and its details by job ID
router.get("/:jobId", authMiddleware, jobController.getJobById);

// Add a new job
router.post("/", authMiddleware, jobController.addJob);

// Add or update job details
router.post("/details", authMiddleware, jobController.addOrUpdateJobDetails);
router.post("/mark-voteable", authMiddleware, jobController.markJobAsVoteable);
router.get("/voteable", authMiddleware, jobController.getVoteableJobs);
router.post("/vote", authMiddleware, jobController.voteForJob);
router.get("/votes", authMiddleware, jobController.getUserVotes);
router.get("/details/:jobId", authMiddleware, jobController.getJobDetails);
router.put("/details", authMiddleware, jobController.updateJobDetails);

module.exports = router;