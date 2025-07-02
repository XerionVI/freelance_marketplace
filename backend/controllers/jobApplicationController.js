const db = require("../db");
const fs = require("fs");

exports.createJobApplication = (req, res) => {
  const { listing_id, freelancer_address, cover_letter, proposed_amount, user_id } = req.body;
  const attachmentPath = req.file ? req.file.path : null;

  if (!listing_id || !freelancer_address || !user_id) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  db.query(
    "INSERT INTO job_applications (listing_id, freelancer_address, cover_letter, proposed_amount, user_id, attachments) VALUES (?, ?, ?, ?, ?, ?)",
    [listing_id, freelancer_address, cover_letter, proposed_amount, user_id, attachmentPath],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Error submitting application" });
      res.status(201).json({ application_id: result.insertId });
    }
  );
};

exports.downloadAttachment = (req, res) => {
  const { application_id } = req.params;
  db.query(
    "SELECT attachments FROM job_applications WHERE id = ?",
    [application_id],
    (err, results) => {
      if (err || !results.length || !results[0].attachments) {
        return res.status(404).json({ message: "Attachment not found" });
      }
      const filePath = path.resolve(results[0].attachments);
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: "File does not exist" });
      }
      res.download(filePath);
    }
  );
};
exports.updateJobApplication = (req, res) => {
  const { application_id } = req.params;
  const { cover_letter, proposed_amount } = req.body;
  const newAttachmentPath = req.file ? req.file.path : null;

  // Get old attachment path
  db.query(
    "SELECT attachments FROM job_applications WHERE id = ?",
    [application_id],
    (err, results) => {
      if (err || !results.length) {
        return res.status(404).json({ message: "Application not found" });
      }
      const oldAttachment = results[0].attachments;

      // Update application
      db.query(
        "UPDATE job_applications SET cover_letter = ?, proposed_amount = ?, attachments = ? WHERE id = ?",
        [cover_letter, proposed_amount, newAttachmentPath || oldAttachment, application_id],
        (err2) => {
          if (err2) return res.status(500).json({ message: "Error updating application" });

          // If new file uploaded, delete old file
          if (newAttachmentPath && oldAttachment && fs.existsSync(oldAttachment)) {
            fs.unlinkSync(oldAttachment);
          }
          res.json({ message: "Application updated" });
        }
      );
    }
  );
};
// Get all applications for a job listing (for client)
exports.getApplicationsForListing = (req, res) => {
  const { listing_id } = req.params;
  db.query(
    "SELECT * FROM job_applications WHERE listing_id = ? ORDER BY created_at DESC",
    [listing_id],
    (err, results) => {
      if (err) return res.status(500).json({ message: "Error fetching applications" });
      res.json(results);
    }
  );
};

// Get all applications by a freelancer
exports.getApplicationsByFreelancer = (req, res) => {
  const { freelancer_address } = req.params;
  db.query(
    "SELECT * FROM job_applications WHERE freelancer_address = ? ORDER BY created_at DESC",
    [freelancer_address],
    (err, results) => {
      if (err) return res.status(500).json({ message: "Error fetching applications" });
      res.json(results);
    }
  );
};

exports.deleteJobApplication = (req, res) => {
  const { application_id } = req.params;

  // Get attachment path
  db.query(
    "SELECT attachments FROM job_applications WHERE id = ?",
    [application_id],
    (err, results) => {
      if (err || !results.length) {
        return res.status(404).json({ message: "Application not found" });
      }
      const attachment = results[0].attachments;

      // Delete application
      db.query(
        "DELETE FROM job_applications WHERE id = ?",
        [application_id],
        (err2) => {
          if (err2) return res.status(500).json({ message: "Error deleting application" });

          // Delete file if exists
          if (attachment && fs.existsSync(attachment)) {
            fs.unlinkSync(attachment);
          }
          res.json({ message: "Application deleted" });
        }
      );
    }
  );
};


exports.updateApplicationStatus = (req, res) => {
  const { application_id } = req.params;
  const { application_status } = req.body;
  if (!application_id || !application_status) {
    return res.status(400).json({ message: "Status or id is required" });
  }
  db.query(
    "UPDATE job_applications SET application_status = ? WHERE application_id = ?",
    [application_status, application_id],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Error updating status" });
      res.json({ message: "Status updated" });
    }
  );
};

const path = require("path");

exports.previewAttachment = (req, res) => {
  const { application_id } = req.params;
  db.query(
    "SELECT attachments FROM job_applications WHERE application_id = ?",
    [application_id],
    (err, results) => {
      if (err || !results.length || !results[0].attachments) {
        return res.status(404).json({ message: "Attachment not found" });
      }
      const filePath = path.resolve(results[0].attachments);
      res.sendFile(filePath);
    }
  );
};
