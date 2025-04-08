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
exports.getJobsByClient = (req, res) => {
  const clientId = req.user.id; // Get the logged-in user's ID from the token

  const query = `SELECT * FROM jobs WHERE client = ?`;
  db.query(query, [clientId], (err, results) => {
    if (err) {
      console.error("Error fetching jobs by client:", err);
      res.status(500).send("Error fetching jobs by client.");
    } else {
      res.status(200).json(results);
    }
  });
};

exports.getJobsByFreelancer = (req, res) => {
  const freelancerId = req.user.id; // Get the logged-in user's ID from the token

  const query = `SELECT * FROM jobs WHERE freelancer = ?`;
  db.query(query, [freelancerId], (err, results) => {
    if (err) {
      console.error("Error fetching jobs by freelancer:", err);
      res.status(500).send("Error fetching jobs by freelancer.");
    } else {
      res.status(200).json(results);
    }
  });
};

exports.markJobAsVoteable = (req, res) => {
  const { jobId } = req.body;

  const query = `UPDATE jobs SET voteable = TRUE WHERE jobId = ?`;
  db.query(query, [jobId], (err, result) => {
    if (err) {
      console.error("Error marking job as voteable:", err);
      res.status(500).send("Error marking job as voteable.");
    } else {
      res.status(200).send({ message: "Job marked as voteable successfully." });
    }
  });
};

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

exports.voteForJob = (req, res) => {
  const { jobId, voteFor } = req.body;
  const voter = req.user.id; // Get the logged-in user's ID from the token

  // Check if the user has already voted for this job
  const checkVoteQuery = `SELECT * FROM votes WHERE jobId = ? AND voter = ?`;
  db.query(checkVoteQuery, [jobId, voter], (err, results) => {
    if (err) {
      console.error("Error checking vote:", err);
      return res.status(500).send("Error checking vote.");
    }

    if (results.length > 0) {
      return res.status(400).send("You have already voted for this job.");
    }

    // Insert the vote into the votes table
    const insertVoteQuery = `INSERT INTO votes (jobId, voter, voteFor) VALUES (?, ?, ?)`;
    db.query(insertVoteQuery, [jobId, voter, voteFor], (err, result) => {
      if (err) {
        console.error("Error casting vote:", err);
        return res.status(500).send("Error casting vote.");
      }

      res.status(200).send({ message: "Vote cast successfully." });
    });
  });
};
exports.getUserVotes = (req, res) => {
  const voter = req.user.id;

  const query = `SELECT jobId FROM votes WHERE voter = ?`;
  db.query(query, [voter], (err, results) => {
    if (err) {
      console.error("Error fetching user votes:", err);
      res.status(500).send("Error fetching user votes.");
    } else {
      res.status(200).json(results);
    }
  });
};
exports.getJobDetails = (req, res) => {
  const { jobId } = req.params;

  // Query to fetch job details
  const query = `SELECT * FROM job_details WHERE jobId = ?`;
  db.query(query, [jobId], (err, results) => {
    if (err) {
      console.error("Error fetching job details:", err);
      return res.status(500).send("Error fetching job details.");
    }

    if (results.length === 0) {
      return res.status(404).send("Job details not found.");
    }

    res.status(200).json(results[0]); // Return the job details
  });
};
exports.updateJobDetails = (req, res) => {
  const { jobId, jobTitle, description, status } = req.body;

  // Check if jobId exists in job_details
  const checkQuery = "SELECT jobId FROM job_details WHERE jobId = ?";
  db.query(checkQuery, [jobId], (err, results) => {
    if (err) {
      console.error("Error checking job details:", err);
      return res.status(500).send("Error checking job details.");
    }

    if (results.length === 0) {
      return res.status(404).send("Job details not found.");
    }

    // Update job details
    const updateQuery = `
      UPDATE job_details
      SET jobTitle = ?, description = ?, status = ?
      WHERE jobId = ?
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