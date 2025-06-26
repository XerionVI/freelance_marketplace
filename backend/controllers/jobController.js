// filepath: d:\Project TA\freelance_marketplace\backend\controllers\jobController.js
// MySQL setup
const db = require("../db");

// Fetch all jobs for the logged-in wallet address
exports.getJobs = (req, res) => {
  const walletAddress = req.headers["wallet-address"];
  if (!walletAddress) {
    return res.status(400).send("Wallet address is required.");
  }

  const query = `
    SELECT 
      j.job_id,
      j.contractJobId,
      j.client,
      j.freelancer,
      j.amount,
      j.status,
      j.blockNumber,
      j.transactionHash,
      j.created_at AS job_created_at,
      j.on_dispute,
      j.job_type,
      jd.job_details_id,
      jd.title,
      jd.description,
      jd.category_id,
      jd.cover_letter,
      jd.deadline,
      jd.delivery_format,
      jd.timezone,
      jd.created_at AS details_created_at
    FROM jobs j
    LEFT JOIN job_details jd ON j.job_id = jd.job_id
    WHERE j.client = ? OR j.freelancer = ?
    ORDER BY j.created_at DESC
  `;

  db.query(query, [walletAddress, walletAddress], (err, results) => {
    if (err) {
      console.error("Error fetching jobs:", err);
      return res.status(500).send("Error fetching jobs.");
    }
    res.status(200).json(results);
  });
};

// Fetch a specific job and its details by job ID and wallet address
exports.getJobById = (req, res) => {
  const walletAddress = req.headers["wallet-address"];
  const { jobId } = req.params;

  if (!walletAddress) {
    return res.status(400).send("Wallet address is required.");
  }

  const query = `
    SELECT 
      j.job_id, j.contractJobId, j.client, j.freelancer, j.amount, j.status, j.blockNumber, j.transactionHash, j.created_at, j.on_dispute, j.job_type,
      jd.title AS Jobtitle, jd.description, jd.category_id, jd.cover_letter, jd.deadline, jd.delivery_format, jd.timezone
    FROM jobs j
    LEFT JOIN job_details jd ON j.job_id = jd.job_id
    WHERE j.job_id = ? AND (j.client = ? OR j.freelancer = ?)
  `;

  db.query(query, [jobId, walletAddress, walletAddress], (err, results) => {
    if (err) {
      console.error("Error fetching job:", err);
      return res.status(500).send("Error fetching job.");
    }

    if (results.length === 0) {
      return res.status(404).send("Job not found.");
    }

    res.status(200).json(results[0]);
  });
};

exports.addJob = (req, res) => {
  const {
    contractJobId,
    client,
    freelancer,
    amount,
    blockNumber,
    transactionHash,
    status,
    on_dispute,
    job_type,
  } = req.body;

  if (typeof contractJobId !== "number" || isNaN(contractJobId)) {
    return res.status(400).send("Valid contractJobId is required.");
  }
  if (!client) {
    return res.status(400).send("Client wallet address is required.");
  }
  if (!freelancer) {
    return res.status(400).send("Freelancer wallet address is required.");
  }
  if (!amount) {
    return res.status(400).send("Amount is required.");
  }

  const query = `
    INSERT INTO jobs (contractJobId, client, freelancer, amount, blockNumber, transactionHash, status, on_dispute, job_type)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [
      contractJobId,
      client,
      freelancer,
      amount,
      blockNumber,
      transactionHash,
      status || "Pending",
      on_dispute ? 1 : 0,
      job_type || "ClientToFreelancer",
    ],
    (err, result) => {
      if (err) {
        console.error("Error inserting job:", err);
        return res.status(500).send("Error saving job data.");
      }

      res.status(201).send({
        jobId: result.insertId,
        contractJobId,
        message: "Job added successfully.",
      });
    }
  );
};

// Add or update job details
exports.addOrUpdateJobDetails = (req, res) => {
  const {
    jobId,
    title,
    description,
    categoryId,
    deadline,
    deliveryFormat,
    timezone,
  } = req.body;

  if (!jobId || !title || !description) {
    return res.status(400).send("Job ID, title, and description are required.");
  }

  // Check if job details already exist
  const checkQuery = "SELECT job_details_id FROM job_details WHERE job_id = ?";
  db.query(checkQuery, [jobId], (err, results) => {
    if (err) {
      console.error("Error checking job details:", err);
      return res.status(500).send("Error checking job details.");
    }

    if (results.length > 0) {
      // Update existing job details
      const updateQuery = `
        UPDATE job_details
        SET title = ?, description = ?, category_id = ?, deadline = ?, delivery_format = ?, timezone = ?
        WHERE job_id = ?
      `;
      db.query(
        updateQuery,
        [
          title,
          description,
          categoryId,
          deadline,
          deliveryFormat,
          timezone,
          jobId,
        ],
        (err) => {
          if (err) {
            console.error("Error updating job details:", err);
            return res.status(500).send("Error updating job details.");
          }
          res.status(200).send("Job details updated successfully.");
        }
      );
    } else {
      // Insert new job details
      const insertQuery = `
        INSERT INTO job_details (job_id, title, description, category_id, deadline, delivery_format, timezone)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      db.query(
        insertQuery,
        [
          jobId,
          title,
          description,
          categoryId,
          deadline,
          deliveryFormat,
          timezone,
        ],
        (err) => {
          if (err) {
            console.error("Error inserting job details:", err);
            return res.status(500).send("Error saving job details.");
          }
          res.status(201).send("Job details added successfully.");
        }
      );
    }
  });
};

exports.createJobWithDetails = (req, res) => {
  const {
    contractJobId,
    client,
    freelancer,
    amount,
    blockNumber,
    transactionHash,
    status,
    on_dispute,
    job_type,
    title,
    description,
    categoryId,
    deadline,
    deliveryFormat,
    timezone,
    cover_letter,
  } = req.body;

  db.beginTransaction((err) => {
    if (err) {
      console.error("Error starting transaction:", err);
      return res.status(500).send("Error starting transaction.");
    }

    // 1. Insert into jobs
    const jobQuery = `
      INSERT INTO jobs (contractJobId, client, freelancer, amount, blockNumber, transactionHash, status, on_dispute, job_type)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    db.query(
      jobQuery,
      [
        contractJobId,
        client,
        freelancer,
        amount,
        blockNumber,
        transactionHash,
        status || "Pending",
        on_dispute ? 1 : 0,
        job_type || "ClientToFreelancer",
      ],
      (err, jobResult) => {
        if (err) {
          return db.rollback(() => {
            console.error("Error inserting job:", err);
            res.status(500).send("Error saving job data.");
          });
        }

        const jobId = jobResult.insertId;

        // 2. Insert into job_details
        const detailsQuery = `
          INSERT INTO job_details (job_id, title, description, category_id, deadline, delivery_format, timezone, cover_letter)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        db.query(
          detailsQuery,
          [
            jobId,
            title,
            description,
            categoryId,
            deadline, // this should now be a valid MySQL datetime string
            deliveryFormat,
            timezone,
            cover_letter || null, // add cover_letter here
          ],
          (err) => {
            if (err) {
              return db.rollback(() => {
                console.error("Error inserting job details:", err);
                res.status(500).send("Error saving job details.");
              });
            }

            db.commit((err) => {
              if (err) {
                return db.rollback(() => {
                  console.error("Error committing transaction:", err);
                  res.status(500).send("Error committing transaction.");
                });
              }
              res.status(201).send({
                jobId,
                contractJobId,
                message: "Job and details added successfully.",
              });
            });
          }
        );
      }
    );
  });
};

// Fetch job details by job ID
exports.getJobDetails = (req, res) => {
  const { jobId } = req.params;

  const query = `SELECT * FROM job_details WHERE job_id = ?`;
  db.query(query, [jobId], (err, results) => {
    if (err) {
      console.error("Error fetching job details:", err);
      return res.status(500).send("Error fetching job details.");
    }

    if (results.length === 0) {
      return res.status(404).send("Job details not found.");
    }

    res.status(200).json(jobDetails);
  });
};

// Update job status
exports.updateJobStatus = (req, res) => {
  const { jobId } = req.params; // Get job ID from the request parameters
  const { status } = req.body; // Get the new status from the request body

  // Validate input
  if (!jobId || !status) {
    return res.status(400).send("Job ID and status are required.");
  }

  // Validate the status value
  const validStatuses = [
    "Pending",
    "Accepted",
    "Completed",
    "Disputed",
    "Declined",
    "Approved",
  ];
  if (!validStatuses.includes(status)) {
    return res.status(400).send("Invalid status value.");
  }

  // Update the job status in the database
  const query = `UPDATE jobs SET status = ? WHERE job_id = ?`;
  db.query(query, [status, jobId], (err, result) => {
    if (err) {
      console.error("Error updating job status:", err);
      return res.status(500).send("Error updating job status.");
    }

    if (result.affectedRows === 0) {
      return res.status(404).send("Job not found.");
    }

    // If status is Approved, increment completed_jobs for the freelancer
    if (status === "Approved") {
      // Get the freelancer's user_id for this job
      db.query(
        "SELECT freelancer FROM jobs WHERE job_id = ?",
        [jobId],
        (err2, rows) => {
          if (err2) {
            console.error("Error fetching freelancer for job:", err2);
            return res.status(500).send("Error updating completed jobs.");
          }
          if (!rows.length) {
            return res.status(404).send("Freelancer not found for this job.");
          }
          const freelancerWallet = rows[0].freelancer;
          // Update completed_jobs in user_profiles
          db.query(
            "UPDATE user_profiles up JOIN users u ON up.user_id = u.id SET up.completed_jobs = IFNULL(up.completed_jobs,0) + 1 WHERE u.wallet_address = ?",
            [freelancerWallet],
            (err3) => {
              if (err3) {
                console.error("Error incrementing completed_jobs:", err3);
                // Don't fail the whole request, just log
              }
              return res.status(200).send({ message: "Job status updated and freelancer's completed jobs incremented." });
            }
          );
        }
      );
    } else {
      res.status(200).send({ message: "Job status updated successfully." });
    }
  });
};

// Update job details
exports.updateJobDetails = (req, res) => {
  const { jobId, jobTitle, description, status } = req.body;

  const checkQuery = "SELECT job_id FROM job_details WHERE job_id = ?";
  db.query(checkQuery, [jobId], (err, results) => {
    if (err) {
      console.error("Error checking job details:", err);
      return res.status(500).send("Error checking job details.");
    }

    if (results.length === 0) {
      return res.status(404).send("Job details not found.");
    }

    const updateQuery = `
      UPDATE job_details
      SET title = ?, description = ?, status = ?
      WHERE job_id = ?
    `;
    db.query(updateQuery, [jobTitle, description, status, jobId], (err) => {
      if (err) {
        console.error("Error updating job details:", err);
        return res.status(500).send("Error updating job details.");
      }

      res.status(200).send("Job details updated successfully.");
    });
  });
};

exports.updateJobOnDispute = (req, res) => {
  const { jobId } = req.params;
  const { on_dispute } = req.body;

  if (typeof on_dispute === "undefined") {
    return res.status(400).send("on_dispute value is required.");
  }

  const query = `UPDATE jobs SET on_dispute = ? WHERE job_id = ?`;
  db.query(query, [on_dispute ? 1 : 0, jobId], (err, result) => {
    if (err) {
      console.error("Error updating on_dispute:", err);
      return res.status(500).send("Error updating on_dispute.");
    }
    if (result.affectedRows === 0) {
      return res.status(404).send("Job not found.");
    }
    res.status(200).send({ message: "on_dispute updated successfully." });
  });
};
