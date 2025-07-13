// Import necessary modules
const db = require("../db");

// Create a new dispute
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

// Get dispute details including evidence and arguments
exports.getDisputeDetails = (req, res) => {
  const { id } = req.params;

  // Query for dispute
  const disputeQuery = `SELECT * FROM disputes WHERE id = ? LIMIT 1`;
  db.query(disputeQuery, [id], (err, disputeResults) => {
    if (err) return res.status(500).send("Error fetching dispute.");
    if (!disputeResults.length) return res.status(404).send("No dispute found.");

    const dispute = disputeResults[0];

    // Query for evidence
    const evidenceQuery = `SELECT * FROM evidence WHERE dispute_id = ? ORDER BY uploaded_at ASC`;
    db.query(evidenceQuery, [id], (err, evidenceResults) => {
      if (err) return res.status(500).send("Error fetching evidence.");

      // Query for arguments
      const argumentsQuery = `SELECT * FROM dispute_arguments WHERE dispute_id = ? ORDER BY submitted_at ASC`;
      db.query(argumentsQuery, [id], (err, argumentsResults) => {
        if (err) return res.status(500).send("Error fetching arguments.");

        // Respond with all details
        res.status(200).json({
          dispute,
          evidence: evidenceResults,
          arguments: argumentsResults,
        });
      });
    });
  });
};

// Update dispute status
exports.updateDisputeStatus = (req, res) => {
  const { id } = req.params;
  const { status, winner_address } = req.body;

  let query, params;

  if (status === "Resolved") {
    // For resolved, update status, resolved_at, and winner_address
    if (!winner_address) {
      return res.status(400).json({ message: "winner_address is required when resolving." });
    }
    query = `UPDATE disputes SET status = ?, resolved_at = NOW(), winner_address = ? WHERE id = ?`;
    params = [status, winner_address, id];
  } else if (status === "Voting") {
    // For voting, update status and voting_started_at
    query = `UPDATE disputes SET status = ?, voting_started_at = NOW() WHERE id = ?`;
    params = [status, id];
  } else {
    // For other statuses, just update status
    query = `UPDATE disputes SET status = ? WHERE id = ?`;
    params = [status, id];
  }

  db.query(query, params, (err, result) => {
    if (err) {
      console.error("Error updating dispute status:", err);
      return res.status(500).json({ message: "Error updating dispute status." });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Dispute not found." });
    }
    res.status(200).json({ message: "Dispute status updated successfully.", id, status, winner_address });
  });
};

// Submit evidence for a party
exports.submitEvidence = (req, res) => {
  const { id } = req.params; // dispute id
  const { party_type } = req.body; // "client" or "freelancer"

  if (!["client", "freelancer"].includes(party_type)) {
    return res.status(400).json({ message: "Invalid party_type." });
  }

  const field =
    party_type === "client"
      ? "client_evidence_submitted"
      : "freelancer_evidence_submitted";

  const query = `UPDATE disputes SET ${field} = 1 WHERE id = ?`;
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error updating evidence status:", err);
      return res.status(500).json({ message: "Error updating evidence status." });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Dispute not found." });
    }
    res.status(200).json({ message: `${party_type} evidence status updated.` });
  });
};