import React from "react";
import { Card, CardContent, Typography } from "@mui/material";

const JobDetails = ({ jobDetails }) => {
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
          <strong>Status:</strong> {jobDetails.status}
        </Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>
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