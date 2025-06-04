import React, { useState, useEffect } from "react";
import { Box, Grid, Container } from "@mui/material";
import JobManagementStats from "./JobManagementStats";
import JobManagementSidebar from "./JobManagementSidebar";
import JobManagementBoard from "./JobManagementBoard";
import axios from "axios";
import config from "../../../config";

const JobManagementHome = ({ account }) => {
  const [jobs, setJobs] = useState([]);
  const token = localStorage.getItem("token");
  const [filters, setFilters] = useState({
    search: "",
    dateFrom: "",
    dateTo: "",
    status: "",
    assignedTo: "",
  });

  useEffect(() => {
    // Fetch all jobs for this account once
    const fetchJobs = async () => {
      try {
        const response = await axios.get(`${config.API_BASE_URL}/api/jobs`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Wallet-Address": account,
          },
        });
        setJobs(response.data);
      } catch (err) {
        setJobs([]);
      }
    };
    fetchJobs();
  }, [account]);

  // Filtering logic (view only)
  const filteredJobs = jobs.filter(job => {
  // Search (title or description)
  if (
    filters.search &&
    !(
      (job.title || "").toLowerCase().includes(filters.search.toLowerCase()) ||
      (job.description || "").toLowerCase().includes(filters.search.toLowerCase())
    )
  ) {
    return false;
  }
  // Status
  if (filters.status && job.status !== filters.status) return false;
  // Created Date (exact match)
  if (
    filters.createdDate &&
    (!job.job_created_at ||
      job.job_created_at.slice(0, 10) !== filters.createdDate)
  )
    return false;
  // Deadline (exact match)
  if (
    filters.deadline &&
    (!job.deadline || job.deadline.slice(0, 10) !== filters.deadline)
  )
    return false;
  return true;
});

  return (
    <Box sx={{ minHeight: "100vh", py: 4 }}>
      <Container maxWidth="xl">
        <JobManagementStats account={account} />
        <Box sx={{ display: "flex", alignItems: "flex-start", mt: 3 }}>
          {/* Sidebar */}
          <Box
            sx={{
              width: { xs: "100%", md: 320 },
              flexShrink: 0,
              position: { md: "sticky" },
              top: { md: 32 },
              alignSelf: "flex-start",
              zIndex: 2,
              mr: { md: 3 },
            }}
          >
            <JobManagementSidebar
              filters={filters}
              setFilters={setFilters}
              jobs={jobs}
              onApplyFilters={() => {}}
            />
          </Box>
          {/* Board */}
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <JobManagementBoard account={account} jobs={filteredJobs} />
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default JobManagementHome;