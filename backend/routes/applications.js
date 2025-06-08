const express = require("express");
const router = express.Router();
const jobAppCtrl = require("../controllers/jobApplicationController");

// Applications
router.post("/", jobAppCtrl.createJobApplication);
router.get("/listing/:listing_id", jobAppCtrl.getApplicationsForListing);
router.get("/freelancer/:freelancer_address", jobAppCtrl.getApplicationsByFreelancer);

module.exports = router;