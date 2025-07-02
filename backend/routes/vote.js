const express = require("express");
const router = express.Router();
const voteController = require("../controllers/voteController");

router.post("/add", voteController.addVote);
router.get("/dispute/:disputeId", voteController.getVotesByDispute);

module.exports = router;