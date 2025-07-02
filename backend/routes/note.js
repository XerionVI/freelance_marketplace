const express = require("express");
const noteController = require("../controllers/noteController");

const router = express.Router();

// Route to add a note to a file
router.post("/:fileId", noteController.addNote);

// Route to fetch all notes for a file
router.get("/:fileId", noteController.getNotes);

module.exports = router;