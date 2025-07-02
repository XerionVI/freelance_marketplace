import React, { useState } from "react";
import { Tabs, Tab, Grid, Typography } from "@mui/material";
import JobListDB from "../jobs/JobListDB";
import JobList from "../jobs/JobList";
// import DisputeHome from "../disputes/DisputeHome";

const TransactionHome = ({ account }) => {
  const [tabValue, setTabValue] = useState("displayJobs");
  const [filter, setFilter] = useState("All Jobs");

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <>
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        centered
        sx={{ mb: 4 }}
      >
        <Tab label="Your Jobs" value="displayJobs" />
        <Tab label="Disputes" value="disputes" />
      </Tabs>

      {tabValue === "displayJobs" && (
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Typography variant="h5">Jobs in the Database</Typography>
            <JobListDB account={account} filter={filter} />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h5">Jobs on Smart Contract</Typography>
            <JobList account={account} filter={filter} />
          </Grid>
        </Grid>
      )}

      {/* {tabValue === "disputes" && (
        <Grid container>
          <Grid item xs={12}>
            <DisputeHome account={account} />
          </Grid>
        </Grid>
      )} */}
    </>
  );
};

export default TransactionHome;