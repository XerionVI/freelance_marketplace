import React from "react";
import { Box, Typography, Stack, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const statusColor = {
  Pending: "#fff3cd",
  Accepted: "#d1ecf1",
  Completed: "#d4edda",
  Disputed: "#f8d7da",
  Declined: "#f8d7da",
};

const statusTextColor = {
  Pending: "#856404",
  Accepted: "#0c5460",
  Completed: "#155724",
  Disputed: "#721c24",
  Declined: "#721c24",
};

const fieldLabels = {
  job_created_at: "Created Date",
  created_at: "Created Date",
  deadline: "Due Date",
  amount: "Amount",
  freelancer: "Freelancer",
  client: "Client",
  status: "Status",
  title: "Title",
};

const JobManagementCard = ({ job }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/job-details/${job.job_id}`);
  };

  // Define which fields to show and in what order
  const fieldsToShow = [
    job.job_created_at !== undefined ? "job_created_at" : "created_at",
    "deadline",
    "amount",
    
  ];

  return (
    <Box
      className="job-card"
      sx={{
        background: "#fff",
        borderRadius: 3,
        p: 3,
        boxShadow: "0 4px 20px rgba(0,0,0,0.10)",
        borderLeft: "5px solid #667eea",
        transition: "all 0.3s",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
        },
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="flex-start"
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography className="job-title" variant="h6" fontWeight={600}>
            {job.title || "-"}
          </Typography>
          <Typography className="job-title" variant="h8" fontWeight={500}>
            {job.description || "-"}
          </Typography>
        </Box>
        <Box
          className={`job-status status-${(job.status || "")
            .toLowerCase()
            .replace(" ", "-")}`}
          sx={{
            px: 2,
            py: 0.5,
            borderRadius: 2,
            fontWeight: 500,
            fontSize: 13,
            bgcolor: statusColor[job.status] || "#eee",
            color: statusTextColor[job.status] || "#333",
            textTransform: "uppercase",
          }}
        >
          {job.status}
        </Box>
      </Stack>
      <Box
        className="job-details"
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2,1fr)",
            md: "repeat(4,1fr)",
          },
          gap: 2,
          mb: 2,
        }}
      >
        {fieldsToShow.map((field) =>
          job[field] !== undefined && job[field] !== null ? (
            <Box className="detail-item" key={field}>
              <Typography className="detail-label" variant="caption">
                {fieldLabels[field] || field}
              </Typography>
              <Typography className="detail-value" fontWeight={500}>
                {field === "job_created_at" || field === "created_at"
                  ? new Date(job[field]).toLocaleDateString()
                  : field === "amount"
                  ? `${job[field]} ETH`
                  : job[field] || "-"}
              </Typography>
            </Box>
          ) : null
        )}
      </Box>
      {/* New stack for client and freelancer */}
      <Stack direction="column" spacing={1} sx={{ mb: 2 }}>
        <Box>
          <Typography className="detail-label" variant="caption">
            Client Address
          </Typography>
          <Typography className="detail-value" fontWeight={500} sx={{ wordBreak: "break-all" }}>
            {job.client || "-"}
          </Typography>
        </Box>
        <Box>
          <Typography className="detail-label" variant="caption">
            Freelancer Address
          </Typography>
          <Typography className="detail-value" fontWeight={500} sx={{ wordBreak: "break-all" }}>
            {job.freelancer || "-"}
          </Typography>
        </Box>
      </Stack>
      <Stack direction="row" spacing={1} className="job-actions" sx={{ mt: 1 }}>
        <Button
          variant="contained"
          color="primary"
          sx={{ borderRadius: 2 }}
          onClick={handleViewDetails}
        >
          View Details
        </Button>
      </Stack>
    </Box>
  );
};

export default JobManagementCard;