require("dotenv").config();

const express = require("express");
const mysql = require("mysql");
const path = require("path");
const multer = require("multer");

const app = express();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// Configure storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "uploads")); // Save files in the "uploads" folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique file name
  },
});

// Initialize multer with storage configuration
const upload = multer({ storage });

// MySQL setup
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL database.");
});

// API route to fetch jobs
app.get("/api/jobs", (req, res) => {
  const query = `SELECT * FROM jobs`;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching jobs:", err);
      res.status(500).send("Error fetching job data.");
    } else {
      res.status(200).json(results);
    }
  });
});

// API route to add a job
app.post("/api/jobs", (req, res) => {
  const { jobId, client, freelancer, amount, blockNumber, transactionHash } = req.body;

  const query = `INSERT INTO jobs (jobId, client, freelancer, amount, blockNumber, transactionHash) VALUES (?, ?, ?, ?, ?, ?)`;

  db.query(query, [jobId, client, freelancer, amount, blockNumber, transactionHash], (err) => {
    if (err) {
      console.error("Error inserting job:", err);
      res.status(500).send("Error saving job data.");
    } else {
      res.status(201).send("Job data saved successfully.");
    }
  });
});

// API route for adding job details with file upload
app.post("/api/job-details", (req, res) => {
  const { jobId, jobTitle, description, status } = req.body;

  // Check if jobId exists in jobs table
  const jobCheckQuery = "SELECT id FROM jobs WHERE id = ?";
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
});



// Serve React frontend for other routes (this must come last)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
