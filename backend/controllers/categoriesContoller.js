const db = require("../db");

// Get all categories
exports.getCategories = (req, res) => {
  db.query("SELECT * FROM categories ORDER BY name ASC", (err, results) => {
    if (err) return res.status(500).json({ message: "Error fetching categories" });
    res.json(results);
  });
};

// Create a new category
exports.createCategory = (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: "Category name required" });
  db.query(
    "INSERT INTO categories (name) VALUES (?)",
    [name],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Error creating category" });
      res.status(201).json({ id: result.insertId, name });
    }
  );
};

// Edit a category
exports.editCategory = (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: "Category name required" });
  db.query(
    "UPDATE categories SET name = ? WHERE id = ?",
    [name, id],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Error updating category" });
      res.json({ message: "Category updated" });
    }
  );
};

// Delete a category
exports.deleteCategory = (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM categories WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ message: "Error deleting category" });
    res.json({ message: "Category deleted" });
  });
};