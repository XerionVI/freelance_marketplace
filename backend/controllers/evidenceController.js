const path = require("path");
const fs = require("fs");
const db = require("../db");

// Multer setup for /uploads/evidences
const multer = require("multer");
const uploadDir = path.join(__dirname, "..", "uploads", "evidences");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + "_" + file.originalname),
});
exports.upload = multer({ storage });

// UPLOAD evidence file and metadata
exports.uploadEvidence = async (req, res) => {
  try {
    const file = req.file;
    const { dispute_id, party_type, description } = req.body;

    if (!file || !dispute_id || !party_type) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const sql = `
      INSERT INTO evidence (dispute_id, party_type, file_name, file_type, description)
      VALUES (?, ?, ?, ?, ?)
    `;
    db.query(
      sql,
      [dispute_id, party_type, file.filename, file.mimetype, description || null],
      (err) => {
        if (err) {
          console.error("Upload evidence error:", err);
          return res.status(500).json({ error: "Internal server error" });
        }
        res.status(201).json({ message: "Evidence uploaded successfully" });
      }
    );
  } catch (err) {
    console.error("Upload evidence error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// GET all evidence for a dispute
exports.getEvidenceByDispute = (req, res) => {
  const { disputeId } = req.params;
  const sql = `SELECT * FROM evidence WHERE dispute_id = ? ORDER BY uploaded_at ASC`;
  db.query(sql, [disputeId], (err, rows) => {
    if (err) {
      console.error("Get evidence error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.json(rows);
  });
};

// DOWNLOAD evidence file by id
exports.downloadEvidence = (req, res) => {
  const { id } = req.params;
  const sql = `SELECT * FROM evidence WHERE id = ? LIMIT 1`;
  db.query(sql, [id], (err, rows) => {
    if (err || !rows || rows.length === 0) {
      return res.status(404).json({ error: "Evidence not found" });
    }
    const evidence = rows[0];
    const filePath = path.join(uploadDir, evidence.file_name);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "File not found on server" });
    }
    res.setHeader("Content-Type", evidence.file_type);
    res.setHeader("Content-Disposition", `attachment; filename="${evidence.file_name}"`);
    fs.createReadStream(filePath).pipe(res);
  });
};