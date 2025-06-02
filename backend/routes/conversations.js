const express = require("express");
const router = express.Router();
const conversationsController = require("../controllers/conversationsController");
const auth = require("../middleware/authMiddleware"); // Your JWT auth middleware

router.use(auth);

router.get("/", conversationsController.getConversations);
router.get("/:id/messages", conversationsController.getMessages);
router.post("/:id/messages", conversationsController.sendMessage);
router.post("/start", conversationsController.startConversation);

module.exports = router;