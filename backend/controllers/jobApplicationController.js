const db = require("../db");

// Submit a job application
exports.createJobApplication = (req, res) => {
  const { listing_id, freelancer_address, cover_letter, proposed_amount } = req.body;
  if (!listing_id || !freelancer_address) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  db.query(
    "INSERT INTO job_applications (listing_id, freelancer_address, cover_letter, proposed_amount) VALUES (?, ?, ?, ?)",
    [listing_id, freelancer_address, cover_letter, proposed_amount],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Error submitting application" });
      res.status(201).json({ application_id: result.insertId });
    }
  );
};

// Get all applications for a job listing (for client)
exports.getApplicationsForListing = (req, res) => {
  const { listing_id } = req.params;
  db.query(
    "SELECT * FROM job_applications WHERE listing_id = ? ORDER BY created_at DESC",
    [listing_id],
    (err, results) => {
      if (err) return res.status(500).json({ message: "Error fetching applications" });
      res.json(results);
    }
  );
};

// Get all applications by a freelancer
exports.getApplicationsByFreelancer = (req, res) => {
  const { freelancer_address } = req.params;
  db.query(
    "SELECT * FROM job_applications WHERE freelancer_address = ? ORDER BY created_at DESC",
    [freelancer_address],
    (err, results) => {
      if (err) return res.status(500).json({ message: "Error fetching applications" });
      res.json(results);
    }
  );
};
