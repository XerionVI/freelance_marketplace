// Import necessary modules
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// MySQL setup
const db = require("../db"); // Adjust the path to your DB connection module

// Ensure the upload directory exists
const uploadDir = path.join(__dirname, "../uploads/works");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads/works")); // Save files in the "uploads" folder
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
  const { uploadedBy } = req.body;

  if (!jobId || !uploadedBy) {
    return res.status(400).send("Job ID and uploadedBy are required.");
  }

  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  const fileName = req.file.filename;
  const filePath = req.file.path;

  const query = `
    INSERT INTO job_files (job_id, file_name, file_path, uploaded_by)
    VALUES (?, ?, ?, ?)
  `;
  db.query(query, [jobId, fileName, filePath, uploadedBy], (err, result) => {
    if (err) {
      console.error("Error saving file metadata:", err); // This will show the real error in your Railway logs
      return res.status(500).json({ message: "Error saving file metadata.", error: err });
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

    // Add file_url for preview
    const filesWithUrl = results.map(file => ({
      ...file,
      file_url: `/uploads/works/${file.file_name}`,
    }));

    res.status(200).json(filesWithUrl);
  });
};

// Download a file by its fileId
exports.downloadFile = (req, res) => {
  const { fileId } = req.params;
  if (!fileId) {
    return res.status(400).send("File ID is required.");
  }

  // Get file info from DB
  const query = `SELECT file_name, file_path FROM job_files WHERE file_id = ?`;
  db.query(query, [fileId], (err, results) => {
    if (err) {
      console.error("Error fetching file info:", err);
      return res.status(500).send("Error fetching file info.");
    }
    if (!results.length) {
      return res.status(404).send("File not found.");
    }

    const { file_name, file_path } = results[0];
    // Ensure the file exists
    fs.access(file_path, fs.constants.F_OK, (err) => {
      if (err) {
        return res.status(404).send("File not found on server.");
      }
      res.download(file_path, file_name); // Stream the file for download
    });
  });
};