const express = require("express");
const router = express.Router();
const evidanceController = require("../controllers/evidenceController");
const authMiddleware = require("../middleware/authMiddleware");

// Upload evidence (POST with file)
router.post(
  "/upload",
  evidanceController.upload.single("file"),
  evidanceController.uploadEvidence
);

// Get all evidence for a dispute
router.get("/dispute/:disputeId",  evidanceController.getEvidenceByDispute);

// Download evidence file by id
router.get("/download/:id", evidanceController.downloadEvidence);

module.exports = router;