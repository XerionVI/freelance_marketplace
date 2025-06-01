const express = require("express");
const userController = require("../controllers/userController");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/profile", auth, userController.getProfile);
router.put("/profile", auth, userController.updateProfile);

module.exports = router;