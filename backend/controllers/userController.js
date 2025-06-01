const mysql = require("mysql"); // Use promise version for async/await
const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// GET /api/user/profile
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user?.id;
    console.log("Fetching profile for user ID:", userId);
    if (!userId) return res.status(401).json({ msg: "Unauthorized" });

    // Get user and profile
    db.query(
      `SELECT 
        u.id, u.username, u.display_name, u.wallet_address, u.role, u.email,
        up.bio, up.profile_picture_url, up.experience_level, up.portfolio_url,
        up.rating, up.completed_jobs, up.is_verified
      FROM users u
      LEFT JOIN user_profiles up ON u.id = up.user_id
      WHERE u.id = ?`,
      [userId],
      (err, users) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ msg: "Server error" });
        }
        if (!users.length) return res.status(404).json({ msg: "User not found" });
        const user = users[0];

        // Get skills
        db.query(
          `SELECT s.id, s.name FROM user_skills us
           JOIN skills s ON us.skill_id = s.id
           WHERE us.user_id = ?`,
          [userId],
          (err2, skills) => {
            if (err2) {
              console.error(err2);
              return res.status(500).json({ msg: "Server error" });
            }

            const profile = {
              id: user.id,
              username: user.username,
              display_name: user.display_name || user.username,
              wallet_address: user.wallet_address,
              role: user.role,
              email: user.email,
              bio: user.bio,
              avatar_url: user.profile_picture_url,
              experience_level: user.experience_level,
              portfolio_url: user.portfolio_url,
              rating: user.rating ? parseFloat(user.rating) : 0,
              completed_jobs: user.completed_jobs || 0,
              is_verified: !!user.is_verified,
              skills: skills || [],
            };

            res.json(profile);
          }
        );
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// PUT /api/user/profile
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ msg: "Unauthorized" });

    const {
      display_name,
      bio,
      avatar_url,
      experience_level,
      portfolio_url,
      skills = [],
    } = req.body;

    // Update users table
    db.query(
      `UPDATE users SET display_name = ? WHERE id = ?`,
      [display_name, userId],
      (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ msg: "Server error" });
        }

        // Update user_profiles table
        db.query(
          `UPDATE user_profiles SET bio = ?, profile_picture_url = ?, experience_level = ?, portfolio_url = ? WHERE user_id = ?`,
          [bio, avatar_url, experience_level, portfolio_url, userId],
          (err2) => {
            if (err2) {
              console.error(err2);
              return res.status(500).json({ msg: "Server error" });
            }

            // Update skills (remove all and re-insert)
            db.query(`DELETE FROM user_skills WHERE user_id = ?`, [userId], (err3) => {
              if (err3) {
                console.error(err3);
                return res.status(500).json({ msg: "Server error" });
              }

              if (!skills.length) {
                return res.json({ msg: "Profile updated successfully" });
              }

              const values = skills.map((skillId) => [userId, skillId]);
              db.query(
                `INSERT INTO user_skills (user_id, skill_id) VALUES ?`,
                [values],
                (err4) => {
                  if (err4) {
                    console.error(err4);
                    return res.status(500).json({ msg: "Server error" });
                  }
                  res.json({ msg: "Profile updated successfully" });
                }
              );
            });
          }
        );
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};