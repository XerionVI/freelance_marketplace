const express = require("express");
const jobController = require("../controllers/jobController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, jobController.getJobs);
router.post("/", authMiddleware, jobController.addJob);
router.post("/details", authMiddleware, jobController.addJobDetails);
router.get("/client", authMiddleware, jobController.getJobsByClient);
router.get("/freelancer", authMiddleware, jobController.getJobsByFreelancer);
router.post("/mark-voteable", authMiddleware, jobController.markJobAsVoteable);
router.get("/voteable", authMiddleware, jobController.getVoteableJobs);
router.post("/vote", authMiddleware, jobController.voteForJob);
router.get("/votes", authMiddleware, jobController.getUserVotes);
router.get("/details/:jobId", authMiddleware, jobController.getJobDetails);
router.put("/details", authMiddleware, jobController.updateJobDetails);

module.exports = router;