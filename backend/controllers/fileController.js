const multer = require("multer"); // Add this line
const mysql = require("mysql");
const path = require("path");

// MySQL setup
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads")); // Save files in the "uploads" folder
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Generate a unique file name
  },
});
const upload = multer({ storage });

// Middleware for handling file uploads
exports.uploadMiddleware = upload.single("file");

// Upload a file for a specific job
exports.uploadJobFile = (req, res) => {
  const { jobId } = req.params;
  const { uploadedBy } = req.body; // Either 'Client' or 'Freelancer'

  if (!jobId || !uploadedBy) {
    return res.status(400).send("Job ID and uploadedBy are required.");
  }

  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  const fileName = req.file.filename;
  const filePath = req.file.path;

  // Insert file metadata into the database
  const query = `
    INSERT INTO job_files (job_id, file_name, file_path, uploaded_by)
    VALUES (?, ?, ?, ?)
  `;
  db.query(query, [jobId, fileName, filePath, uploadedBy], (err, result) => {
    if (err) {
      console.error("Error saving file metadata:", err);
      return res.status(500).send("Error saving file metadata.");
    }

    res.status(200).send({
      message: "File uploaded successfully.",
      fileId: result.insertId,
      fileName,
      filePath,
    });
  });
};

// Fetch all files for a specific job
exports.getJobFiles = (req, res) => {
  const { jobId } = req.params;

  if (!jobId) {
    return res.status(400).send("Job ID is required.");
  }

  const query = `
    SELECT file_id, file_name, file_path, uploaded_by, uploaded_at
    FROM job_files
    WHERE job_id = ?
  `;
  db.query(query, [jobId], (err, results) => {
    if (err) {
      console.error("Error fetching job files:", err);
      return res.status(500).send("Error fetching job files.");
    }

    res.status(200).json(results);
  });
};