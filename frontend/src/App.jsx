import React, { useState, useEffect } from "react";
import { Container, Box, Typography, Tabs, Tab, Button, Alert, Grid } from "@mui/material";
import axios from "axios";
import AuthForm from "./components/auth/AuthForm";
import CreateJobForm from "./components/jobs/CreateJobForm";
import JobListDB from "./components/jobs/JobListDB";
import JobList from "./components/jobs/JobList";
import VoteableJobs from "./components/disputes/VoteableJobs";
import JobDetailsPage from "./components/jobs/JobDetailsPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import listenForJobCreated from "./utils/listenForJobCreated";
import Layout from "./components/shared/layout/Layout"; // Import Layout

function App() {
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All Jobs");
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [username, setUsername] = useState(null);
  const [tabValue, setTabValue] = useState("displayJobs");

  useEffect(() => {
    const connectWallet = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
          console.log("Connected account:", accounts[0]);
          setAccount(accounts[0]);

          listenForJobCreated(accounts[0]);

          window.ethereum.on("accountsChanged", (accounts) => {
            console.log("Account changed:", accounts[0]);
            setAccount(accounts[0] || null);

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
        handleLogout();
      }
    }
  };

  useEffect(() => {
    if (token) {
      fetchUsername();
    }
  }, [account, token]);

  const handleAuthSuccess = (token) => {
    localStorage.setItem("token", token);
    setToken(token);
    fetchUsername();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUsername(null);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Router>
      <Layout account={account} onLogout={handleLogout}>
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
            <Route
              path="/"
              element={
                <>
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
                        <CreateJobForm account={account} />
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
            <Route
              path="/job-details/:jobId"
              element={<JobDetailsPage account={account} token={token} />}
            />
          </Routes>
        )}
      </Layout>
    </Router>
  );
}

export default App;