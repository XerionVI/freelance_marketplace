const db = require("../db");

// POST /api/reviews
exports.createReview = async (req, res) => {
  const { job_id, rating, comment, reviewer_wallet } = req.body;

  // Get job details to determine reviewer/reviewee
  db.query(
    "SELECT client, freelancer FROM jobs WHERE job_id = ?",
    [job_id],
    (err, jobs) => {
      if (err || !jobs.length)
        return res.status(400).json({ msg: "Invalid job" });
      const job = jobs[0];

      // Get reviewer and reviewee user IDs
      db.query(
        "SELECT id, wallet_address FROM users WHERE wallet_address = ? OR wallet_address = ?",
        [job.client, job.freelancer],
        (err2, users) => {
          if (err2) return res.status(400).json({ msg: "User mapping error" });

          // Find users explicitly
          const clientUser = users.find(
            (u) => u.wallet_address.toLowerCase() === job.client.toLowerCase()
          );
          const freelancerUser = users.find(
            (u) =>
              u.wallet_address.toLowerCase() === job.freelancer.toLowerCase()
          );
          if (!clientUser || !freelancerUser) {
            // Log for debugging
            console.error("User not found for job:", { job, users });
            return res
              .status(400)
              .json({ msg: "Client or freelancer not found in users table" });
          }

          let reviewer_id, reviewee_wallet;
          if (reviewer_wallet.toLowerCase() === job.client.toLowerCase()) {
            reviewer_id = clientUser.id;
            reviewee_wallet = job.freelancer;
          } else if (
            reviewer_wallet.toLowerCase() === job.freelancer.toLowerCase()
          ) {
            reviewer_id = freelancerUser.id;
            reviewee_wallet = job.client;
          } else {
            return res
              .status(403)
              .json({ msg: "You are not part of this job" });
          }

          // Get reviewee_id
          db.query(
            "SELECT id FROM users WHERE wallet_address = ?",
            [reviewee_wallet],
            (err3, revieweeRows) => {
              if (err3 || !revieweeRows.length)
                return res.status(400).json({ msg: "Reviewee not found" });
              const reviewee_id = revieweeRows[0].id;

              // Prevent duplicate reviews
              db.query(
                "SELECT * FROM reviews WHERE job_id = ? AND reviewer_id = ? AND reviewee_id = ?",
                [job_id, reviewer_id, reviewee_id],
                (err4, existing) => {
                  if (err4)
                    return res.status(500).json({ msg: "Server error" });
                  if (existing.length)
                    return res.status(400).json({
                      msg: "You already reviewed this user for this job",
                    });

                  // Insert review
                  db.query(
                    "INSERT INTO reviews (job_id, reviewer_id, reviewee_id, rating, comment) VALUES (?, ?, ?, ?, ?)",
                    [job_id, reviewer_id, reviewee_id, rating, comment],
                    (err5) => {
                      if (err5)
                        return res.status(500).json({ msg: "Server error" });

                      // Recalculate and update average rating for reviewee
                      db.query(
                        "SELECT AVG(rating) AS avg_rating FROM reviews WHERE reviewee_id = ?",
                        [reviewee_id],
                        (err6, avgRows) => {
                          if (err6) {
                            // Log error but don't fail the review submission
                            console.error(
                              "Failed to recalculate average rating:",
                              err6
                            );
                            return res.json({
                              msg: "Review submitted, but rating not updated",
                            });
                          }
                          const avgRating = avgRows[0].avg_rating || 0;
                          db.query(
                            "UPDATE user_profiles SET rating = ? WHERE user_id = ?",
                            [avgRating, reviewee_id],
                            (err7) => {
                              if (err7) {
                                console.error(
                                  "Failed to update user rating:",
                                  err7
                                );
                                return res.json({
                                  msg: "Review submitted, but rating not updated",
                                });
                              }
                              res.json({
                                msg: "Review submitted and rating updated",
                              });
                            }
                          );
                        }
                      );
                    }
                  );
                }
              );
            }
          );
        }
      );
    }
  );
};
exports.getUserReviews = (req, res) => {
  const userId = req.params.id;
  db.query(
    `SELECT r.*, u.display_name AS reviewer_name, up.profile_picture_url AS reviewer_avatar
     FROM reviews r
     JOIN users u ON r.reviewer_id = u.id
     LEFT JOIN user_profiles up ON u.id = up.user_id
     WHERE r.reviewee_id = ?
     ORDER BY r.created_at DESC`,
    [userId],
    (err, rows) => {
      if (err) return res.status(500).json({ msg: "Failed to fetch reviews" });
      res.json(rows);
    }
  );
};
