import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Alert, Tabs, Tab } from "react-bootstrap";
import axios from "axios";
import AuthForm from "./components/AuthForm";
import CreateJobForm from "./components/CreateJobForm";
import JobListDB from "./components/JobListDB";
import JobList from "./components/JobList";
import VoteableJobs from "./components/VoteableJobs";

function App() {
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All Jobs");
  const [token, setToken] = useState(localStorage.getItem("token")); // Load token from localStorage
  const [username, setUsername] = useState(null);

  useEffect(() => {
      const connectWallet = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
          setAccount(accounts[0]); // Set the first account as the connected wallet
          window.ethereum.on("accountsChanged", (accounts) => {
            setAccount(accounts[0] || null); // Update the account when it changes
          });
        } catch (error) {
          alert("Error connecting to MetaMask.");
        }
      } else {
        alert("MetaMask is not installed.");
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

  return (
    <Container className="mt-5">
      <h1 className="text-center mb-4">Freelance Marketplace</h1>

      <div className="text-center mb-4">
        {account ? (
          <Alert variant="info">
            Connected as {account}
            {username && <div>Logged in as: <strong>{username}</strong></div>}
          </Alert>
        ) : (
          <Alert variant="warning">Please connect to MetaMask.</Alert>
        )}
      </div>

      {!token ? (
        <Row>
          <Col md={6}>
            <AuthForm isLogin={true} onAuthSuccess={handleAuthSuccess} />
          </Col>
          <Col md={6}>
            <AuthForm isLogin={false} onAuthSuccess={handleAuthSuccess} />
          </Col>
        </Row>
      ) : (
        <>
          <div className="text-end mb-3">
            <Button variant="danger" onClick={handleLogout}>
              Logout
            </Button>
          </div>
          <Tabs defaultActiveKey="displayJobs" id="freelance-tabs" className="mb-4">
            <Tab eventKey="createJob" title="Create Job">
              <Row>
                <Col md={8} className="mx-auto">
                  <CreateJobForm account={account} onJobCreated={handleJobCreated} />
                </Col>
              </Row>
            </Tab>

            <Tab eventKey="displayJobs" title="Display Jobs">
              <Row>
                <Col md={12}>
                  <h3>Jobs in the Database</h3>
                  <JobListDB account={account} filter={filter} />
                  <h3>Jobs on Smart Contract</h3>
                  <JobList account={account} filter={filter} />
                </Col>
              </Row>
            </Tab>
            <Tab eventKey="voteableJobs" title="Voteable Jobs">
              <Row>
                <Col md={12}>
                  <VoteableJobs />
                </Col>
              </Row>
            </Tab>
          </Tabs>
        </>
      )}
    </Container>
  );
}

export default App;