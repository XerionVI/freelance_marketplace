import React, { useState, useEffect } from "react";
import { Box, Typography, Button, Stack } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import JobManagementCard from "./JobManagementCard";
import axios from "axios";
import config from "../../../config";

const JobManagementBoard = ({ account }) => {
  const [jobs, setJobs] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get(`${config.API_BASE_URL}/api/jobs`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Wallet-Address": account,
          },
        });
        setJobs(Array.isArray(response.data) ? response.data : []);
      } catch {
        setJobs([]);
      }
    };
    if (account) fetchJobs();
  }, [account, token]);

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
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            background: "linear-gradient(45deg, #667eea, #764ba2)",
            color: "#fff",
            borderRadius: 2,
            fontWeight: 500,
            px: 3,
            py: 1,
            boxShadow: 2,
            "&:hover": { opacity: 0.9, background: "linear-gradient(45deg, #667eea, #764ba2)" }
          }}
          onClick={() => alert("Add New Job functionality would open a modal or new page")}
        >
          Add New Job
        </Button>
      </Stack>
      <Stack spacing={3}>
        {jobs.map((job) => (
          <JobManagementCard key={job.job_id} job={job} />
        ))}
      </Stack>
    </Box>
  );
};

export default JobManagementBoard;