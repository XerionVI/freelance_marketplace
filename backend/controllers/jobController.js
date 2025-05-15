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

// Fetch all jobs for the logged-in wallet address
exports.getJobs = (req, res) => {
  const walletAddress = req.headers["wallet-address"];
  if (!walletAddress) {
    return res.status(400).send("Wallet address is required.");
  }

  const query = `
    SELECT j.job_id, j.contractJobId, j.client, j.freelancer, j.amount, j.status, j.blockNumber, j.transactionHash, j.created_at,
           jd.title AS jobTitle, jd.description AS jobDescription
    FROM jobs j
    LEFT JOIN job_details jd ON j.job_id = jd.job_id
    WHERE j.client = ? OR j.freelancer = ?
  `;

  db.query(query, [walletAddress, walletAddress], (err, results) => {
    if (err) {
      console.error("Error fetching jobs:", err);
      return res.status(500).send("Error fetching jobs.");
    }
    res.status(200).json(results);
  });
};

// Fetch a specific job and its details by job ID and wallet address
exports.getJobById = (req, res) => {
  const walletAddress = req.headers["wallet-address"];
  const { jobId } = req.params;

  if (!walletAddress) {
    return res.status(400).send("Wallet address is required.");
  }

  const query = `
    SELECT j.job_id, j.contractJobId, j.client, j.freelancer, j.amount, j.status, j.blockNumber, j.transactionHash, j.created_at,
           jd.title AS jobTitle, jd.description
    FROM jobs j
    LEFT JOIN job_details jd ON j.job_id = jd.job_id
    WHERE j.job_id = ? AND (j.client = ? OR j.freelancer = ?)
  `;

  db.query(query, [jobId, walletAddress, walletAddress], (err, results) => {
    if (err) {
      console.error("Error fetching job:", err);
      return res.status(500).send("Error fetching job.");
    }

    if (results.length === 0) {
      return res.status(404).send("Job not found.");
    }

    res.status(200).json(results[0]);
  });
};

exports.addJob = (req, res) => {
  const { contractJobId, client, freelancer, amount, blockNumber, transactionHash, status } = req.body;

  if (typeof contractJobId !== "number" || isNaN(contractJobId)) {
    return res.status(400).send("Valid contractJobId is required.");
  }
  if (!client) {
    return res.status(400).send("Client wallet address is required.");
  }

  const query = `
    INSERT INTO jobs (contractJobId, client, freelancer, amount, blockNumber, transactionHash, status)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [
      contractJobId,
      client,
      freelancer,
      amount,
      blockNumber,
      transactionHash,
      status || "Pending"
    ],
    (err, result) => {
      if (err) {
        console.error("Error inserting job:", err);
        return res.status(500).send("Error saving job data.");
      }

      res.status(201).send({
        jobId: result.insertId,
        contractJobId,
        message: "Job added successfully."
      });
    }
  );
};

// Add or update job details
exports.addOrUpdateJobDetails = (req, res) => {
  const { jobId, title, description } = req.body;

  if (!jobId || !title || !description) {
    return res.status(400).send("Job ID, title, and description are required.");
  }

  // Check if job details already exist
  const checkQuery = "SELECT job_details_id FROM job_details WHERE job_id = ?";
  db.query(checkQuery, [jobId], (err, results) => {
    if (err) {
      console.error("Error checking job details:", err);
      return res.status(500).send("Error checking job details.");
    }

    if (results.length > 0) {
      // Update existing job details
      const updateQuery = `
        UPDATE job_details
        SET title = ?, description = ?
        WHERE job_id = ?
      `;
      db.query(updateQuery, [title, description, jobId], (err) => {
        if (err) {
          console.error("Error updating job details:", err);
          return res.status(500).send("Error updating job details.");
        }

        res.status(200).send("Job details updated successfully.");
      });
    } else {
      // Insert new job details
      const insertQuery = `
        INSERT INTO job_details (job_id, title, description)
        VALUES (?, ?, ?)
      `;
      db.query(insertQuery, [jobId, title, description], (err) => {
        if (err) {
          console.error("Error inserting job details:", err);
          return res.status(500).send("Error saving job details.");
        }

        res.status(201).send("Job details added successfully.");
      });
    }
  });
};

// Fetch job details by job ID
exports.getJobDetails = (req, res) => {
  const { jobId } = req.params;

  const query = `SELECT * FROM job_details WHERE job_id = ?`;
  db.query(query, [jobId], (err, results) => {
    if (err) {
      console.error("Error fetching job details:", err);
      return res.status(500).send("Error fetching job details.");
    }

    if (results.length === 0) {
      return res.status(404).send("Job details not found.");
    }

    res.status(200).json(results[0]);
  });
};

// Update job status
exports.updateJobStatus = (req, res) => {
  const { jobId } = req.params; // Get job ID from the request parameters
  const { status } = req.body; // Get the new status from the request body

  // Validate input
  if (!jobId || !status) {
    return res.status(400).send("Job ID and status are required.");
  }

  // Validate the status value
  const validStatuses = ["Pending", "Accepted", "Completed", "Disputed", "Declined"];
  if (!validStatuses.includes(status)) {
    return res.status(400).send("Invalid status value.");
  }

  // Update the job status in the database
  const query = `UPDATE jobs SET status = ? WHERE job_id = ?`;
  db.query(query, [status, jobId], (err, result) => {
    if (err) {
      console.error("Error updating job status:", err);
      return res.status(500).send("Error updating job status.");
    }

    if (result.affectedRows === 0) {
      return res.status(404).send("Job not found.");
    }

    res.status(200).send({ message: "Job status updated successfully." });
  });
};

// Update job details
exports.updateJobDetails = (req, res) => {
  const { jobId, jobTitle, description, status } = req.body;

  const checkQuery = "SELECT job_id FROM job_details WHERE job_id = ?";
  db.query(checkQuery, [jobId], (err, results) => {
    if (err) {
      console.error("Error checking job details:", err);
      return res.status(500).send("Error checking job details.");
    }

    if (results.length === 0) {
      return res.status(404).send("Job details not found.");
    }

    const updateQuery = `
      UPDATE job_details
      SET title = ?, description = ?, status = ?
      WHERE job_id = ?
    `;
    db.query(updateQuery, [jobTitle, description, status, jobId], (err) => {
      if (err) {
        console.error("Error updating job details:", err);
        return res.status(500).send("Error updating job details.");
      }

      res.status(200).send("Job details updated successfully.");
    });
  });
};