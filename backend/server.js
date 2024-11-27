require("dotenv").config();

const express = require("express");
const mysql = require("mysql");
const path = require("path");

const app = express();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend/dist")));

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

// API routes
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

// Serve React frontend for other routes
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
