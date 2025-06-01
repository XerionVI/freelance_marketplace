const mysql = require("mysql");
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// GET /api/skills - get all skills
exports.getAllSkills = (req, res) => {
  db.query("SELECT id, name FROM skills ORDER BY name ASC", (err, results) => {
    if (err) {
      console.error("Error fetching skills:", err);
      return res.status(500).json({ msg: "Server error" });
    }
    res.json(results);
  });
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