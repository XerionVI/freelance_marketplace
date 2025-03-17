// filepath: d:\Project TA\freelance_marketplace\frontend\src\App.jsx
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Alert, Tab, Tabs } from "react-bootstrap";
import CreateJobForm from "./components/CreateJobForm";
import JobList from "./components/JobList";
import JobListDB from "./components/JobListDB";
import AuthForm from "./components/AuthForm";
import { ethers } from "ethers";
import { getFreelanceEscrowContract } from "./utils/getFreelanceEscrow";
import axios from "axios";

function App() {
  const [account, setAccount] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All Jobs");
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    const connectWallet = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
          setAccount(accounts[0]);
          window.ethereum.on("accountsChanged", (accounts) => {
            setAccount(accounts[0] || null);
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

  const fetchJobs = async () => {
    if (!account || !token) return;
    setLoading(true);
    try {
      const response = await axios.get("/api/jobs", {
        headers: { Authorization: token },
      });
      setJobs(response.data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
    setLoading(false);
  };

  const handleJobCreated = (newJob) => {
    setJobs((prevJobs) => [...prevJobs, newJob]);
  };

  useEffect(() => {
    fetchJobs();
  }, [account, token]);

  const handleAuthSuccess = (token) => {
    setToken(token);
  };

  return (
    <Container className="mt-5">
      <h1 className="text-center mb-4">Freelance Marketplace</h1>

      <div className="text-center mb-4">
        {account ? (
          <Alert variant="info">Connected as {account}</Alert>
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
        <Tabs defaultActiveKey="displayJobs" id="freelance-tabs" className="mb-4">
          {/* Tab for Creating Job */}
          <Tab eventKey="createJob" title="Create Job">
            <Row>
              <Col md={8} className="mx-auto">
                <CreateJobForm account={account} onJobCreated={handleJobCreated} />
              </Col>
            </Row>
          </Tab>

          {/* Tab for Displaying Jobs */}
          <Tab eventKey="displayJobs" title="Display Jobs">
            <Row>
              <Col md={12}>
                <h3>Jobs on Smart Contract</h3>
                <JobList account={account} filter={filter} jobs={jobs} loading={loading} />

                <h3 className="mt-4">Jobs in the Database</h3>
                <JobListDB account={account} filter={filter} />
              </Col>
            </Row>
          </Tab>
        </Tabs>
      )}
    </Container>
  );
}

export default App;