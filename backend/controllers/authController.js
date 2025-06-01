const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const mysql = require("mysql");

// MySQL setup
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, email, password, display_name, wallet_address, role } = req.body;

  try {
    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
      if (results.length > 0) {
        return res.status(400).json({ msg: "User already exists" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      db.query(
        "INSERT INTO users (username, email, password, display_name, wallet_address, role) VALUES (?, ?, ?, ?, ?, ?)",
        [username, email, hashedPassword, display_name, wallet_address, role],
        (err, result) => {
          if (err) {
            console.error("Error inserting user:", err);
            return res.status(500).send("Server error");
          }

          // Insert into user_profiles after user is created
          db.query(
            "INSERT INTO user_profiles (user_id) VALUES (?)",
            [result.insertId],
            (err2) => {
              if (err2) {
                console.error("Error creating user profile:", err2);
                return res.status(500).send("Server error");
              }

              const payload = {
                user: {
                  id: result.insertId,
                },
              };

              jwt.sign(
                payload,
                process.env.JWT_SECRET,
                { expiresIn: "1h" },
                (err, token) => {
                  if (err) throw err;
                  res.json({ token });
                }
              );
            }
          );
        }
      );
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    // Check if user exists
    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
      if (results.length === 0) {
        return res.status(400).json({ msg: "Invalid email" });
      }

      const user = results[0];
      
      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: "Invalid password" });
      }

      const payload = {
        user: {
          id: user.id,
        },
      };
      
      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: "1h" }, // Token expires in 1 hour
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.getMe = (req, res) => {
  const userId = req.user.id;

  db.query("SELECT username FROM users WHERE id = ?", [userId], (err, results) => {
    if (err) {
      console.error("Error fetching user details:", err);
      return res.status(500).send("Server error");
    }

    if (results.length === 0) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json({ username: results[0].username });
  });
};