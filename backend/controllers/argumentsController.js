const db = require("../db");

// Add a new argument
exports.addArgument = (req, res) => {
  const { dispute_id, 
    party_type, 
    party_address,
    argument_text 
  } = req.body;
 
  const sql = `
    INSERT INTO dispute_arguments (dispute_id, party_type, party_address, argument_text)
    VALUES (?, ?, ?, ?)
  `;
  db.query(
    sql,
    [dispute_id, party_type, party_address, argument_text],
    (err, result) => {
      if (err) {
        console.error("Add argument error:", err);
        return res.status(500).json({ error: "Internal server error" });
      }
      res
        .status(201)
        .json({ message: "Argument added successfully", id: result.insertId });
    }
  );
};

// Get all arguments for a dispute
exports.getArgumentsByDispute = (req, res) => {
  const { disputeId } = req.params;
  const sql = `
    SELECT * FROM dispute_arguments
    WHERE dispute_id = ?
    ORDER BY submitted_at ASC
  `;
  db.query(sql, [disputeId], (err, rows) => {
    if (err) {
      console.error("Get arguments error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.json(rows);
  });
};