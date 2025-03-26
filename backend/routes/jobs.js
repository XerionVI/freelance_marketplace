const express = require("express");
const jobController = require("../controllers/jobController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, jobController.getJobs);
router.post("/", authMiddleware, jobController.addJob);
router.post("/details", authMiddleware, jobController.addJobDetails);

module.exports = router;