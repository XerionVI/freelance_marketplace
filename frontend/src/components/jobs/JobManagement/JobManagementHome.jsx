import React from "react";
import { Box, Grid, Container } from "@mui/material";
import JobManagementStats from "./JobManagementStats";
import JobManagementSidebar from "./JobManagementSidebar";
import JobManagementBoard from "./JobManagementBoard";

const JobManagementHome = ({ account }) => (
  <Box
    sx={{
      minHeight: "100vh",
      py: 4,
    }}
  >
    <Container maxWidth="xl">
      <JobManagementStats account={account} />
      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12} md={4} lg={3}>
          <JobManagementSidebar />
        </Grid>
        <Grid item xs={12} md={8} lg={9}>
          <JobManagementBoard account={account} />
        </Grid>
      </Grid>
    </Container>
  </Box>
);

export default JobManagementHome;