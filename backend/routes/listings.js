const express = require("express");
const router = express.Router();
const jobListingController = require("../controllers/jobListingController");

// Job listings
router.get("/listings", jobListingController.getJobListings);
router.get("/listings/:id", jobListingController.getJobListingById);
router.post("/listings", jobListingController.createJobListing);
router.put("/listings/:id", jobListingController.editJobListing);
router.delete("/listings/:id", jobListingController.deleteJobListing);

module.exports = router;