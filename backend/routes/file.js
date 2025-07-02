const express = require("express");
const fileController = require("../controllers/fileController");
const fs = require("fs");
const path = require("path");

const router = express.Router();

// Route to upload a file for a specific job
router.post("/upload/:jobId", fileController.uploadMiddleware, fileController.uploadJobFile);

// route to download a file by its name
router.get("/download/:fileId", fileController.downloadFile);

// Route to fetch all files for a specific job
router.get("/:jobId", fileController.getJobFiles);

// Route to download a file by its ID
router.get("/download/:fileId", fileController.downloadFile);

module.exports = router;