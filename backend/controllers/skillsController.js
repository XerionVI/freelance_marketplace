
const db = require("../db"); // adjust to your DB connection module

// GET /api/skills - get all skills
exports.getAllSkills = (req, res) => {
 try {
    db.query("SELECT id, name FROM skills ORDER BY name ASC", (err, results) => {
      if (err) {
        console.error("Error fetching skills:", err);
        // Send the full error for debugging (remove in production)
        return res.status(500).json({ msg: "Server error", error: err });
      }
      res.json(results);
    });
  } catch (error) {
    console.error("Unexpected error in getAllSkills:", error);
    res.status(500).json({ msg: "Unexpected server error", error: error.stack });
  }
};

// POST /api/skills - add a new skill (optional, admin use)
exports.addSkill = (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ msg: "Skill name is required" });
  db.query(
    "INSERT INTO skills (name) VALUES (?)",
    [name],
    (err, result) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(400).json({ msg: "Skill already exists" });
        }
        console.error("Error adding skill:", err);
        return res.status(500).json({ msg: "Server error" });
      }
      res.status(201).json({ id: result.insertId, name });
    }
  );
};