const mysql = require("mysql");

// MySQL setup
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Mark a job as voteable
exports.markJobAsVoteable = (req, res) => {
  const { jobId } = req.body;
  const query = `UPDATE jobs SET voteable = TRUE WHERE job_id = ?`;
  db.query(query, [jobId], (err, result) => {
    if (err) {
      console.error("Error marking job as voteable:", err);
      res.status(500).send("Error marking job as voteable.");
    } else {
      res.status(200).send({ message: "Job marked as voteable successfully." });
    }
  });
};

// Get all voteable jobs
exports.getVoteableJobs = (req, res) => {
  const query = `SELECT * FROM jobs WHERE voteable = TRUE`;
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching voteable jobs:", err);
      res.status(500).send("Error fetching voteable jobs.");
    } else {
      res.status(200).json(results);
    }
  });
};

// Cast a vote for a dispute
exports.voteForDispute = (req, res) => {
  const { disputeId, voteFor } = req.body;
  const voter = req.user.id; // or req.user.wallet

  // Prevent double voting
  const checkVoteQuery = `SELECT * FROM votes WHERE dispute_id = ? AND voter = ?`;
  db.query(checkVoteQuery, [disputeId, voter], (err, results) => {
    if (err) {
      console.error("Error checking vote:", err);
      return res.status(500).send("Error checking vote.");
    }
    if (results.length > 0) {
      return res.status(400).send("You have already voted for this dispute.");
    }
    // Insert the vote
    const insertVoteQuery = `INSERT INTO votes (dispute_id, voter, voteFor) VALUES (?, ?, ?)`;
    db.query(insertVoteQuery, [disputeId, voter, voteFor], (err, result) => {
      if (err) {
        console.error("Error casting vote:", err);
        return res.status(500).send("Error casting vote.");
      }
      res.status(200).send({ message: "Vote cast successfully." });
    });
  });
};

// Get all disputes a user has voted on
exports.getUserVotes = (req, res) => {
  const voter = req.user.id;
  const query = `SELECT dispute_id FROM votes WHERE voter = ?`;
  db.query(query, [voter], (err, results) => {
    if (err) {
      console.error("Error fetching user votes:", err);
      res.status(500).send("Error fetching user votes.");
    } else {
      res.status(200).json(results);
    }
  });
};

// Get vote counts for a dispute
exports.getVoteCounts = (req, res) => {
  const { disputeId } = req.params;
  const query = `SELECT SUM(voteFor = 1) AS votesFor, SUM(voteFor = 0) AS votesAgainst FROM votes WHERE dispute_id = ?`;
  db.query(query, [disputeId], (err, results) => {
    if (err) return res.status(500).send("Error fetching vote counts.");
    res.status(200).json(results[0]);
  });
};