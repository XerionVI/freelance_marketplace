const express = require("express");
const conversationsController = require("../controllers/conversationsController");
const auth = require("../middleware/authMiddleware"); // Your JWT auth middleware

const router = express.Router();

router.get("/", auth, conversationsController.getConversations);
router.get("/:id/messages", auth, conversationsController.getMessages);
router.post("/:id/messages", auth, conversationsController.sendMessage);
router.post("/start", auth, conversationsController.startConversation);

module.exports = router;