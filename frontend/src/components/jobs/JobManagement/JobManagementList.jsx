import React, { useEffect, useState } from "react";
import { Grid, CircularProgress, Alert } from "@mui/material";
import JobManagementCard from "./JobManagementCard";
import axios from "axios";
import config from "../../../config";

const JobManagementList = ({ account }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${config.API_BASE_URL}/api/jobs`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Wallet-Address": account,
          },
        });
        setJobs(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };
    if (account) fetchJobs();
  }, [account, token]);

  if (!account) return <Alert severity="warning">Please connect your wallet.</Alert>;
  if (loading) return <CircularProgress sx={{ mt: 4 }} />;
  if (jobs.length === 0) return <Alert severity="info">No jobs found.</Alert>;

  return (
    <Grid container spacing={3}>
      {jobs.map((job) => (
        <Grid item xs={12} md={6} lg={4} key={job.job_id}>
          <JobManagementCard job={job} account={account} />
        </Grid>
      ))}
    </Grid>
  );
};

export default JobManagementList;