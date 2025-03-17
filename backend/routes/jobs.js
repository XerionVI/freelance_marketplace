// filepath: d:\Project TA\freelance_marketplace\backend\routes\jobs.js
const express = require("express");
const jobController = require("../controllers/jobController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// API route to fetch jobs
router.get("/", authMiddleware, jobController.getJobs);

// API route to add a job
router.post("/", authMiddleware, jobController.addJob);

// API route for adding job details with file upload
router.post("/details", authMiddleware, jobController.addJobDetails);

module.exports = router;