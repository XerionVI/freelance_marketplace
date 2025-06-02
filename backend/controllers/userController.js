const mysql = require("mysql"); // Use promise version for async/await
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Multer setup for avatar uploads
const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, "../uploads/avatars");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `avatar_${req.user.id}_${Date.now()}${ext}`;
    cb(null, uniqueName);
  },
});
const uploadAvatar = multer({ storage: avatarStorage });

// Middleware for route
exports.avatarUploadMiddleware = uploadAvatar.single("avatar");

// Controller for avatar upload
exports.uploadAvatar = (req, res) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ msg: "Unauthorized" });

  if (!req.file) return res.status(400).json({ msg: "No file uploaded" });

  const avatarUrl = `/uploads/avatars/${req.file.filename}`;

  // Update user_profiles table with new avatar URL
  db.query(
    "UPDATE user_profiles SET profile_picture_url = ? WHERE user_id = ?",
    [avatarUrl, userId],
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ msg: "Server error" });
      }
      res.json({ avatar_url: avatarUrl });
    }
  );
};

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

// GET /api/users/:id/profile (public, no auth)
exports.getPublicProfile = (req, res) => {
  const userId = req.params.id;
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
      if (err) return res.status(500).json({ msg: "Server error" });
      if (!users.length) return res.status(404).json({ msg: "User not found" });
      const user = users[0];
      db.query(
        `SELECT s.id, s.name FROM user_skills us
         JOIN skills s ON us.skill_id = s.id
         WHERE us.user_id = ?`,
        [userId],
        (err2, skills) => {
          if (err2) return res.status(500).json({ msg: "Server error" });
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

exports.browseFreelancers = (req, res) => {
  // Parse filters and pagination
  let {
    skills,
    experience,
    rate_min,
    rate_max,
    rating,
    verified,
    sort = "relevance",
    page = 1,
    limit = 10,
  } = req.query;

  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;
  const offset = (page - 1) * limit;

  let where = "u.role = 'freelancer'";
  let params = [];

  // Skills filter (array or single)
  if (skills) {
  const skillArr = Array.isArray(skills) ? skills : [skills];
  if (skillArr.length > 0 && skillArr[0] !== "") {
    where += ` AND s.name IN (${skillArr.map(() => "?").join(",")})`;
    params.push(...skillArr);
  }
}

  // Experience level
  if (experience) {
    where += " AND up.experience_level = ?";
    params.push(experience);
  }

  // Hourly rate
  if (rate_min) {
    where += " AND up.hourly_rate >= ?";
    params.push(rate_min);
  }
  if (rate_max) {
    where += " AND up.hourly_rate <= ?";
    params.push(rate_max);
  }

  // Rating
  if (rating) {
    where += " AND up.rating >= ?";
    params.push(rating);
  }

  // Verified
  if (verified === "true" || verified === 1 || verified === "1") {
    where += " AND up.is_verified = 1";
  }

  // Sorting
  let orderBy = "u.id DESC";
  if (sort === "newest") orderBy = "u.created_at DESC";
  else if (sort === "top-rated") orderBy = "up.rating DESC";
  else if (sort === "lowest-rate") orderBy = "up.hourly_rate ASC";
  else if (sort === "highest-rate") orderBy = "up.hourly_rate DESC";

  // Main query
  const sql = `
  SELECT 
    u.id, u.display_name, u.username, u.wallet_address, u.role,
    MAX(up.bio) AS bio,
    MAX(up.profile_picture_url) AS avatar_url,
    MAX(up.experience_level) AS experience_level,
    MAX(up.portfolio_url) AS portfolio_url,
    MAX(up.rating) AS rating,
    MAX(up.completed_jobs) AS completed_jobs,
    MAX(up.is_verified) AS is_verified,
    MAX(up.hourly_rate) AS hourly_rate,
    MAX(up.availability) AS availability,
    GROUP_CONCAT(DISTINCT s.name) AS skills
  FROM users u
  LEFT JOIN user_profiles up ON u.id = up.user_id
  LEFT JOIN user_skills us ON u.id = us.user_id
  LEFT JOIN skills s ON us.skill_id = s.id
  WHERE ${where}
  GROUP BY u.id
  ORDER BY ${orderBy}
  LIMIT ? OFFSET ?
`;

  // Count query for pagination
  const countSql = `
    SELECT COUNT(DISTINCT u.id) AS total
    FROM users u
    LEFT JOIN user_profiles up ON u.id = up.user_id
    LEFT JOIN user_skills us ON u.id = us.user_id
    LEFT JOIN skills s ON us.skill_id = s.id
    WHERE ${where}
  `;

  const paramsWithLimit = [...params, limit, offset];

  db.query(countSql, params, (err, countResult) => {
  if (err) {
    console.error("Count SQL error:", err);
    return res.status(500).json({ msg: "Server error", error: err });
  }
  const total = countResult[0]?.total || 0;
  const totalPages = Math.ceil(total / limit);

  db.query(sql, paramsWithLimit, (err2, rows) => {
    if (err2) {
      console.error("Main SQL error:", err2);
      return res.status(500).json({ msg: "Server error", error: err2 });
    }
    const freelancers = rows.map(f => ({
      ...f,
      skills: f.skills ? f.skills.split(",").map(name => ({ name })) : [],
    }));
    res.json({ freelancers, totalPages });
  });
});
};