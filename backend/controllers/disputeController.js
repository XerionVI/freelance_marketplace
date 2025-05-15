
const mysql = require("mysql");

// MySQL setup
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Create a new dispute
exports.createDispute = (req, res) => {
  const { jobId, client, freelancer, description } = req.body;
  const query = `INSERT INTO disputes (job_id, client, freelancer, description, resolved) VALUES (?, ?, ?, ?, 0)`;
  db.query(query, [jobId, client, freelancer, description], (err, result) => {
    if (err) return res.status(500).send("Error creating dispute.");
    res.status(200).json({ disputeId: result.insertId, jobId, client, freelancer, description, resolved: false });
  });
};

// Get a dispute by contractJobId
exports.getDisputeByContractJobId = (req, res) => {
  const { contractJobId } = req.params;
  const query = `SELECT * FROM disputes WHERE job_id = ? LIMIT 1`;
  db.query(query, [contractJobId], (err, results) => {
    if (err) return res.status(500).send("Error fetching dispute.");
    if (results.length === 0) return res.status(404).send("No dispute found.");
    res.status(200).json(results[0]);
  });
};

// (Optional) Get all disputes for a user
exports.getUserDisputes = (req, res) => {
  const user = req.user.wallet; // or req.user.id
  const query = `SELECT * FROM disputes WHERE client = ? OR freelancer = ?`;
  db.query(query, [user, user], (err, results) => {
    if (err) return res.status(500).send("Error fetching user disputes.");
    res.status(200).json(results);
  });
};

// (Optional) Get a dispute by its disputeId
exports.getDisputeById = (req, res) => {
  const { disputeId } = req.params;
  const query = `SELECT * FROM disputes WHERE dispute_id = ?`;
  db.query(query, [disputeId], (err, results) => {
    if (err) return res.status(500).send("Error fetching dispute.");
    if (results.length === 0) return res.status(404).send("No dispute found.");
    res.status(200).json(results[0]);
  });
};

// disputeController.js
exports.getVoteableDisputes = (req, res) => {
  const query = `SELECT * FROM disputes WHERE resolved = 0`;
  db.query(query, (err, results) => {
    if (err) return res.status(500).send("Error fetching disputes.");
    res.status(200).json(results);
  });
};