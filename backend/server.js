require("dotenv").config();

const express = require("express");
const mysql = require("mysql");
const path = require("path");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
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

// Import authentication routes
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

// Import job routes
const jobRoutes = require("./routes/jobs");
app.use("/api/jobs", jobRoutes);

// Import file routes
const fileRoutes = require("./routes/file");
app.use("/api/files", fileRoutes);

const noteRoutes = require("./routes/note");
app.use("/api/notes", noteRoutes);

// Import vote routes
const voteRoutes = require("./routes/vote");
app.use("/api/votes", voteRoutes);

// Import dispute routes
const disputeRoutes = require("./routes/disputes");
app.use("/api/disputes", disputeRoutes);

// Import user profile routes
const userRoutes = require("./routes/users");
app.use("/api/users", userRoutes);

// Import skills routes
const skillsRoutes = require("./routes/skills");
app.use("/api/skills", skillsRoutes);

// Serve uploads/works as static files
app.use("/uploads/works", express.static(path.join(__dirname, "uploads/works")));

// Serve React frontend for other routes (this must come last)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});


// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});