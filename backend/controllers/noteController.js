// MySQL setup
const db = require("../db");


// Add a note to a file
exports.addNote = (req, res) => {
  const { fileId } = req.params;
  const { note, addedBy } = req.body;

  if (!fileId || !note || !addedBy) {
    return res.status(400).send("File ID, note, and addedBy are required.");
  }

  const query = `
    INSERT INTO file_notes (file_id, note, added_by)
    VALUES (?, ?, ?)
  `;
  db.query(query, [fileId, note, addedBy], (err, result) => {
    if (err) {
      console.error("Error adding note:", err);
      return res.status(500).send("Error adding note.");
    }

    res.status(200).send({
      message: "Note added successfully.",
      noteId: result.insertId,
    });
  });
};

// Fetch all notes for a file
exports.getNotes = (req, res) => {
  const { fileId } = req.params;

  if (!fileId) {
    return res.status(400).send("File ID is required.");
  }

  const query = `
    SELECT note_id, note, added_by, added_at
    FROM file_notes
    WHERE file_id = ?
    ORDER BY added_at ASC
  `;
  db.query(query, [fileId], (err, results) => {
    if (err) {
      console.error("Error fetching notes:", err);
      return res.status(500).send("Error fetching notes.");
    }

    res.status(200).json(results);
  });
};