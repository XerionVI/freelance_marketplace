const express = require("express");
const fileController = require("../controllers/fileController");

const router = express.Router();

// Route to upload a file for a specific job
router.post("/upload/:jobId", fileController.uploadMiddleware, fileController.uploadJobFile);

// Route to fetch all files for a specific job
router.get("/:jobId", fileController.getJobFiles);

module.exports = router;