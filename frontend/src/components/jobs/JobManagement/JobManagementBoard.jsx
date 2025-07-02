import React from "react";
import { Box, Typography, Stack } from "@mui/material";
import JobManagementCard from "./JobManagementCard";

const JobManagementBoard = ({ jobs = [] }) => {
  return (
    <Box
      sx={{
        bgcolor: "rgba(255,255,255,0.95)",
        borderRadius: 3,
        p: 4,
        boxShadow: "0 8px 32px rgba(31,38,135,0.15)",
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={700}>Job Management Dashboard</Typography>
      </Stack>
      <Stack spacing={3}>
        {jobs.length === 0 ? (
          <Typography color="text.secondary" align="center">
            No jobs found.
          </Typography>
        ) : (
          jobs.map((job) => (
            <JobManagementCard key={job.job_id} job={job} />
          ))
        )}
      </Stack>
    </Box>
  );
};

export default JobManagementBoard;