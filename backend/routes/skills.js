const express = require("express");
const router = express.Router();
const skillsController = require("../controllers/skillsController");

// GET all skills
router.get("/", skillsController.getAllSkills);

// (Optional) POST add a new skill
router.post("/", skillsController.addSkill);

module.exports = router;