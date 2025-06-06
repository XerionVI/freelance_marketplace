const db = require("../db");

// Add a vote
exports.addVote = (req, res) => {
  const { dispute_id, voter_address, choice } = req.body;
  if (!dispute_id || !voter_address || !choice) {
    return res.status(400).json({ message: "Missing required fields." });
  }
  const sql = `
    INSERT INTO votes (dispute_id, voter_address, choice)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE choice = VALUES(choice)
  `;
  db.query(sql, [dispute_id, voter_address, choice], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Error saving vote.", error: err });
    }
    res.status(200).json({ message: "Vote recorded." });
  });
};

// Get votes for a dispute
exports.getVotesByDispute = (req, res) => {
  const { disputeId } = req.params;
  db.query(
    "SELECT * FROM votes WHERE dispute_id = ?",
    [disputeId],
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Error fetching votes." });
      }
      res.status(200).json(results);
    }
  );
};