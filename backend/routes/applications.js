const express = require("express");
const router = express.Router();
const jobAppCtrl = require("../controllers/jobApplicationController");
const auth = require("../middleware/authMiddleware"); // Your JWT auth middleware

const multer = require("multer");
const path = require("path");

const fs = require("fs");
const uploadDir = "uploads/applications";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/applications");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

router.post(
  "/",
  auth,
  upload.single("attachment"),
  jobAppCtrl.createJobApplication
);

router.get("/listing/:listing_id", jobAppCtrl.getApplicationsForListing);
router.get("/freelancer/:freelancer_address", jobAppCtrl.getApplicationsByFreelancer);

router.put("/status/:application_id", jobAppCtrl.updateApplicationStatus);

router.get("/download/:application_id", jobAppCtrl.downloadAttachment);

router.put(
  "/:application_id",
  auth,
  upload.single("attachment"),
  jobAppCtrl.updateJobApplication
);

router.get("/preview/:application_id", jobAppCtrl.previewAttachment);

router.delete("/:application_id", auth, jobAppCtrl.deleteJobApplication);

module.exports = router;