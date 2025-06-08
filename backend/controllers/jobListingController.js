const db = require("../db");

// Get all job listings
exports.getJobListings = (req, res) => {
  db.query("SELECT * FROM job_listings ORDER BY created_at DESC", (err, results) => {
    if (err) return res.status(500).json({ message: "Error fetching job listings" });
    res.json(results);
  });
};

// Get a single job listing by ID
exports.getJobListingById = (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM job_listings WHERE listing_id = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ message: "Error fetching job listing" });
    if (results.length === 0) return res.status(404).json({ message: "Job listing not found" });
    res.json(results[0]);
  });
};

exports.createJobListing = (req, res) => {
  const {
    client_address,
    title,
    description,
    category_id,
    required_skills, // <-- new
    budget,
    deadline,
    delivery_format,
    timezone,
    status
  } = req.body;
  if (!client_address || !title || !description || !budget) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  db.query(
    `INSERT INTO job_listings 
      (client_address, title, description, category_id, required_skills, budget, deadline, delivery_format, timezone, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      client_address,
      title,
      description,
      category_id,
      required_skills, // comma-separated skill IDs or names
      budget,
      deadline,
      delivery_format,
      timezone,
      status || "Open"
    ],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Error creating job listing" });
      res.status(201).json({ listing_id: result.insertId });
    }
  );
};

// Edit a job listing
exports.editJobListing = (req, res) => {
  const { id } = req.params;
  const {
    title,
    description,
    category_id,
    required_skills, // <-- new
    budget,
    deadline,
    delivery_format,
    timezone,
    status
  } = req.body;
  db.query(
    `UPDATE job_listings SET 
      title = ?, description = ?, category_id = ?, required_skills = ?, budget = ?, deadline = ?, delivery_format = ?, timezone = ?, status = ?
      WHERE listing_id = ?`,
    [
      title,
      description,
      category_id,
      required_skills,
      budget,
      deadline,
      delivery_format,
      timezone,
      status,
      id
    ],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Error updating job listing" });
      res.json({ message: "Job listing updated" });
    }
  );
};

// Delete a job listing
exports.deleteJobListing = (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM job_listings WHERE listing_id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ message: "Error deleting job listing" });
    res.json({ message: "Job listing deleted" });
  });
};