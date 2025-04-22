import React, { useState, useEffect } from "react";
import { Container, Box, Typography, Tabs, Tab, Button, Alert, Grid } from "@mui/material";
import axios from "axios";
import AuthForm from "./components/AuthForm";
import CreateJobForm from "./components/CreateJobForm";
import JobListDB from "./components/JobListDB";
import JobList from "./components/JobList";
import VoteableJobs from "./components/VoteableJobs";
import JobDetailsPage from "./components/JobDetailsPage"; // Import the JobDetailsPage component
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import listenForJobCreated from "./utils/listenForJobCreated"; // Import the utility function

function App() {
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All Jobs");
  const [token, setToken] = useState(localStorage.getItem("token")); // Load token from localStorage
  const [username, setUsername] = useState(null);
  const [tabValue, setTabValue] = useState("displayJobs");

  useEffect(() => {
    const connectWallet = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
          console.log("Connected account:", accounts[0]);
          setAccount(accounts[0]); // Set the first account as the connected wallet

          // Start listening for JobCreated events after wallet is connected
          listenForJobCreated(accounts[0]);

          // Handle account changes
          window.ethereum.on("accountsChanged", (accounts) => {
            console.log("Account changed:", accounts[0]);
            setAccount(accounts[0] || null); // Update the account when it changes

            // Restart event listener for the new account
            if (accounts[0]) {
              listenForJobCreated(accounts[0]);
            }
          });
        } catch (error) {
          console.error("Error connecting to MetaMask:", error);
        }
      } else {
        console.error("MetaMask is not installed.");
      }
    };

    connectWallet();
  }, []);

  const fetchUsername = async () => {
    if (!token) return;
    try {
      const response = await axios.get("http://localhost:5000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsername(response.data.username);
    } catch (error) {
      console.error("Error fetching username:", error);
      if (error.response && error.response.status === 401) {
        handleLogout(); // Log the user out if the token is invalid
      }
    }
  };

  useEffect(() => {
    if (token) {
      fetchUsername();
    }
  }, [account, token]);

  const handleAuthSuccess = (token) => {
    localStorage.setItem("token", token); // Save the token in localStorage
    setToken(token);
    fetchUsername();
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove the token from localStorage
    setToken(null);
    setUsername(null);
  };

  const handleJobCreated = (jobData) => {
    console.log("Job created:", jobData);
    alert(`Job "${jobData.title}" has been successfully created!`);
    // Add additional logic here to update the UI if needed
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Router>
      <Container maxWidth="lg" sx={{ mt: 5 }}>
        <Typography variant="h3" align="center" gutterBottom>
          Freelance Marketplace
        </Typography>

        <Box sx={{ mb: 4 }}>
          {account ? (
            <Alert severity="info">
              Connected as {account}
              {username && (
                <Typography variant="body1">
                  Logged in as: <strong>{username}</strong>
                </Typography>
              )}
            </Alert>
          ) : (
            <Alert severity="warning">Please connect to MetaMask.</Alert>
          )}
        </Box>

        {!token ? (
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <AuthForm isLogin={true} onAuthSuccess={handleAuthSuccess} />
            </Grid>
            <Grid item xs={12} md={6}>
              <AuthForm isLogin={false} onAuthSuccess={handleAuthSuccess} />
            </Grid>
          </Grid>
        ) : (
          <Routes>
            {/* Main Tabs */}
            <Route
              path="/"
              element={
                <>
                  <Box sx={{ textAlign: "right", mb: 3 }}>
                    <Button variant="contained" color="error" onClick={handleLogout}>
                      Logout
                    </Button>
                  </Box>
                  <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    indicatorColor="primary"
                    textColor="primary"
                    centered
                    sx={{ mb: 4 }}
                  >
                    <Tab label="Create Job" value="createJob" />
                    <Tab label="Display Jobs" value="displayJobs" />
                    <Tab label="Voteable Jobs" value="voteableJobs" />
                  </Tabs>

                  {tabValue === "createJob" && (
                    <Grid container justifyContent="center">
                      <Grid item xs={12} md={8}>
                        <CreateJobForm account={account} onJobCreated={handleJobCreated} />
                      </Grid>
                    </Grid>
                  )}

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

                  {tabValue === "voteableJobs" && (
                    <Grid container>
                      <Grid item xs={12}>
                        <VoteableJobs />
                      </Grid>
                    </Grid>
                  )}
                </>
              }
            />

            {/* Job Details Page */}
            <Route
              path="/job-details/:jobId"
              element={<JobDetailsPage account={account} token={token} />}
            />
          </Routes>
        )}
      </Container>
    </Router>
  );
}

export default App;