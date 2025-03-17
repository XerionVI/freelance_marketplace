// filepath: d:\Project TA\freelance_marketplace\backend\controllers\jobController.js
const mysql = require("mysql");

// MySQL setup
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

exports.getJobs = (req, res) => {
  const query = `SELECT * FROM jobs WHERE client = ? OR freelancer = ?`;
  db.query(query, [req.user.id, req.user.id], (err, results) => {
    if (err) {
      console.error("Error fetching jobs:", err);
      res.status(500).send("Error fetching job data.");
    } else {
      res.status(200).json(results);
    }
  });
};

exports.addJob = (req, res) => {
  const { freelancer, amount, blockNumber, transactionHash } = req.body;
  const client = req.user.id;

  const query = `INSERT INTO jobs (client, freelancer, amount, blockNumber, transactionHash) VALUES (?, ?, ?, ?, ?)`;

  db.query(query, [client, freelancer, amount, blockNumber, transactionHash], (err, result) => {
    if (err) {
      console.error("Error inserting job:", err);
      res.status(500).send("Error saving job data.");
    } else {
      res.status(201).send({ jobId: result.insertId, message: "Job data saved successfully." });
    }
  });
};

exports.addJobDetails = (req, res) => {
  const { jobId, jobTitle, description, status } = req.body;

  // Check if jobId exists in jobs table
  const jobCheckQuery = "SELECT jobId FROM jobs WHERE jobId = ?";
  db.query(jobCheckQuery, [jobId], (err, results) => {
    if (err) {
      console.error("Error checking job ID:", err);
      return res.status(500).send("Error checking job ID.");
    }

    if (results.length === 0) {
      return res.status(400).send("Invalid jobId: Job does not exist.");
    }

    // Check if jobId already has a record in job_details
    const detailsCheckQuery = "SELECT jobId FROM job_details WHERE jobId = ?";
    db.query(detailsCheckQuery, [jobId], (err, results) => {
      if (err) {
        console.error("Error checking job details:", err);
        return res.status(500).send("Error checking job details.");
      }

      if (results.length > 0) {
        return res.status(400).send("Job details already exist for this jobId.");
      }

      // Insert into job_details
      const insertQuery = `
        INSERT INTO job_details (jobId, jobTitle, description, status, filePath)
        VALUES (?, ?, ?, ?, NULL)
      `;
      db.query(insertQuery, [jobId, jobTitle, description, status], (err) => {
        if (err) {
          console.error("Error inserting job details:", err);
          return res.status(500).send("Error saving job details.");
        }

        res.status(201).send("Job details saved successfully.");
      });
    });
  });
};