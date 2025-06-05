const mysql = require("mysql");

// MySQL setup
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

exports.createDispute = (req, res) => {
  const {
    id, // disputeId from contract
    job_id,
    client_address,
    freelancer_address,
    amount_eth,
    status,
    dispute_reason,
  } = req.body;

  const query = `
    INSERT INTO disputes (
      id, job_id, client_address, freelancer_address, amount_eth, status, dispute_reason
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  db.query(
  query,
  [id, job_id, client_address, freelancer_address, amount_eth, status, dispute_reason],
  (err, result) => {
    if (err) {
      console.error("Error creating dispute:", err);
      return res.status(500).send("Error creating dispute.");
    }
    res.status(200).json({
      id,
      job_id,
      client_address,
      freelancer_address,
      amount_eth,
      status,
      dispute_reason,
    });
  }
);
};

// Get all disputes
exports.getAllDisputes = (req, res) => {
  const query = `SELECT * FROM disputes ORDER BY created_at DESC`;
  db.query(query, (err, results) => {
    if (err) return res.status(500).send("Error fetching all disputes.");
    res.status(200).json(results);
  });
};

// Get disputes by status (optional)
exports.getDisputesByStatus = (req, res) => {
  const { status } = req.params;
  const query = `SELECT * FROM disputes WHERE status = ? ORDER BY created_at DESC`;
  db.query(query, [status], (err, results) => {
    if (err) return res.status(500).send("Error fetching disputes.");
    res.status(200).json(results);
  });
};

// Get a single dispute by id
exports.getDisputeById = (req, res) => {
  const { id } = req.params;
  const query = `SELECT * FROM disputes WHERE id = ? LIMIT 1`;
  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).send("Error fetching dispute.");
    if (results.length === 0) return res.status(404).send("No dispute found.");
    res.status(200).json(results[0]);
  });
};