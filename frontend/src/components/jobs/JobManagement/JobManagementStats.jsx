import React, { useEffect, useState } from "react";
import { Grid, Paper, Typography } from "@mui/material";
import axios from "axios";
import config from "../../../config";

const statusLabels = {
  Pending: "Pending",
  Accepted: "In Progress",
  Completed: "Completed",
  Disputed: "Disputed",
  Declined: "Declined",
};

const JobManagementStats = ({ account }) => {
  const [stats, setStats] = useState({
    total: 0,
    inProgress: 0,
    completed: 0,
    pending: 0,
  });
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`${config.API_BASE_URL}/api/jobs`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Wallet-Address": account,
          },
        });
        const jobs = Array.isArray(response.data) ? response.data : [];
        setStats({
          total: jobs.length,
          inProgress: jobs.filter(j => j.status === "Accepted").length,
          completed: jobs.filter(j => j.status === "Completed").length,
          pending: jobs.filter(j => j.status === "Pending").length,
        });
      } catch {
        setStats({ total: 0, inProgress: 0, completed: 0, pending: 0 });
      }
    };
    if (account) fetchStats();
  }, [account, token]);

  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      <Grid >
        <Paper elevation={3} sx={{ p: 2, borderRadius: 3, textAlign: "center" }}>
          <Typography variant="h5" color="primary" fontWeight={700}>{stats.total}</Typography>
          <Typography variant="body2">Total Jobs</Typography>
        </Paper>
      </Grid>
      <Grid >
        <Paper elevation={3} sx={{ p: 2, borderRadius: 3, textAlign: "center" }}>
          <Typography variant="h5" color="info.main" fontWeight={700}>{stats.inProgress}</Typography>
          <Typography variant="body2">In Progress</Typography>
        </Paper>
      </Grid>
      <Grid >
        <Paper elevation={3} sx={{ p: 2, borderRadius: 3, textAlign: "center" }}>
          <Typography variant="h5" color="success.main" fontWeight={700}>{stats.completed}</Typography>
          <Typography variant="body2">Completed</Typography>
        </Paper>
      </Grid>
      <Grid >
        <Paper elevation={3} sx={{ p: 2, borderRadius: 3, textAlign: "center" }}>
          <Typography variant="h5" color="warning.main" fontWeight={700}>{stats.pending}</Typography>
          <Typography variant="body2">Pending</Typography>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default JobManagementStats;