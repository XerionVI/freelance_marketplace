import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";

const JobDetails = ({ jobDetails }) => {
  // Determine the color and background color based on the status
  const getStatusStyles = (status) => {
    switch (status?.toLowerCase()) {
      case "declined":
        return { color: "white", backgroundColor: "red" };
      case "accepted":
        return { color: "white", backgroundColor: "green" };
      case "pending":
        return { color: "black", backgroundColor: "orange" };
      case "completed":
        return { color: "white", backgroundColor: "blue" };
      case "disputed":
        return { color: "white", backgroundColor: "purple" };
      default:
        return { color: "black", backgroundColor: "lightgray" };
    }
  };

  return (
    <Card sx={{ mb: 4 }}>
      <CardContent>
        <Typography variant="h4" gutterBottom>
          Job Details
        </Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>
          <strong>Job ID:</strong> {jobDetails.job_id}
        </Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>
          <strong>Client:</strong> {jobDetails.client}
        </Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>
          <strong>Freelancer:</strong> {jobDetails.freelancer}
        </Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>
          <strong>Amount:</strong> {jobDetails.amount} ETH
        </Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>
          <strong>Status:</strong>{" "}
          <Box
            component="span"
            sx={{
              display: "inline-block",
              px: 1.5,
              py: 0.5,
              borderRadius: 1,
              ...getStatusStyles(jobDetails.status),
            }}
          >
            {jobDetails.status}
          </Box>
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          <strong>Job Title:</strong> {jobDetails.jobTitle || "N/A"}
        </Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>
          <strong>Description:</strong> {jobDetails.description || "N/A"}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default JobDetails;