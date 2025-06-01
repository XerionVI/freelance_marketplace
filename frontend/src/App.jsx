import React, { useState, useEffect } from "react";
import { Container, Box, Typography, Tabs, Tab, Grid } from "@mui/material";
import axios from "axios";
import AuthForm from "./components/auth/AuthForm";
import CreateJobForm from "./components/jobs/CreateJobForm";
import JobListDB from "./components/jobs/JobListDB";
import JobList from "./components/jobs/JobList";
import DisputeHome from "./components/disputes/DisputeHome";
import JobDetailsPage from "./components/jobs/JobDetailsPage";
import Layout from "./components/shared/layout/Layout";
import LandingPage from "./components/Home/LandingPage";
import HomePage from "./components/Home/HomePage";
import UserProfile from "./components/User/UserProfile";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import listenForJobCreated from "./utils/listenForJobCreated";
import { ethers } from "ethers";

function App() {
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All Jobs");
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [username, setUsername] = useState(null);
  const [tabValue, setTabValue] = useState("displayJobs");
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const connectWallet = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
          const normalizedAccount = ethers.getAddress(accounts[0]);
          setAccount(normalizedAccount);

          listenForJobCreated(normalizedAccount);

          window.ethereum.on("accountsChanged", (accounts) => {
            if (accounts.length > 0) {
              const normalizedChangedAccount = ethers.getAddress(accounts[0]);
              setAccount(normalizedChangedAccount);
              listenForJobCreated(normalizedChangedAccount);
            } else {
              setAccount(null);
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
      if (error.response && error.response.status === 401) {
        handleLogout();
      }
    }
  };

  const fetchUserProfile = async () => {
    if (!token) return;
    try {
      const response = await axios.get("http://localhost:5000/api/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserProfile(response.data);
    } catch (error) {
      setUserProfile(null);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUsername();
      fetchUserProfile();
    }
  }, [account, token]);

  const handleAuthSuccess = (token) => {
    localStorage.setItem("token", token);
    setToken(token);
    fetchUsername();
    fetchUserProfile();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUsername(null);
    setUserProfile(null);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Router>
      <Layout account={account} token={token} onLogout={handleLogout}>
        <Routes>
          {/* Landing Page (public) */}
          <Route
            path="/"
            element={
              !token ? (
                <LandingPage
                  onLogin={() => window.location.replace("/auth")}
                  onSignUp={() => window.location.replace("/auth")}
                />
              ) : (
                // Authenticated home/dashboard
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
                    <Tab label="Disputes" value="disputes" />
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

                  {tabValue === "disputes" && (
                    <Grid container>
                      <Grid item xs={12}>
                        <DisputeHome account={account} />
                      </Grid>
                    </Grid>
                  )}
                </>
              )
            }
          />
          {/* Home Page */}
          <Route
            path="/home"
            element={
              <HomePage
                onLogin={() => window.location.replace("/auth")}
                onRegister={() => window.location.replace("/auth")}
              />
            }
          />
          {/* Auth Page */}
          <Route
            path="/auth"
            element={
              <Grid container justifyContent="center">
                <Grid item xs={12} md={6}>
                  <AuthForm onAuthSuccess={handleAuthSuccess} />
                </Grid>
              </Grid>
            }
          />
          {/* Job Details Page */}
          <Route
            path="/job-details/:jobId"
            element={<JobDetailsPage account={account} token={token} />}
          />
          {/* User Profile Page */}
          <Route
            path="/profile"
            element={<UserProfile profile={userProfile} />}
          />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;