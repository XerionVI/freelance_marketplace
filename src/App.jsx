import React, { useEffect, useState } from "react";
import { Container, Row, Col, Alert, Button, Table, Dropdown } from "react-bootstrap";
import CreateJobForm from "./components/CreateJobForm";
import JobList from "./components/JobList"; // Import your JobList component
import "bootstrap/dist/css/bootstrap.min.css";
import { ethers } from "ethers";
import { getFreelanceEscrowContract } from "./utils/getFreelanceEscrow";

function App() {
  const [account, setAccount] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All Jobs"); // Default filter to "All Jobs"

  // Prompt user to connect MetaMask on load
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

  // Fetch jobs from the contract
  const fetchJobs = async () => {
    if (!account) return;
    setLoading(true);
    try {
      const contract = await getFreelanceEscrowContract(account);
      const totalJobs = await contract.getTotalJobs();
      const jobDetails = [];
      const currentAccountAddress = account.toLowerCase();

      for (let i = 0; i < totalJobs; i++) {
        const job = await contract.getJobDetails(i);
        const jobObj = {
          jobId: i,
          client: job.client,
          freelancer: job.freelancer,
          amount: ethers.formatEther(job.amount),
          status: job.status === 0 ? "Created" : job.status === 1 ? "Completed" : "Approved",
        };

        if (
          filter === "All Jobs" ||
          currentAccountAddress === job.client.toLowerCase() ||
          currentAccountAddress === job.freelancer.toLowerCase()
        ) {
          jobDetails.push(jobObj);
        }
      }
      setJobs(jobDetails);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
    setLoading(false);
  };

  // Update job list dynamically
  const handleJobUpdated = () => {
    fetchJobs();
  };

  useEffect(() => {
    fetchJobs();
  }, [account, filter]);

  return (
    <Container className="mt-5">
      <h1 className="text-center mb-4">Freelance Marketplace</h1>

      <div className="text-center mb-4">
        {account ? (
          <Alert variant="info">Connected as: {account}</Alert>
        ) : (
          <Button onClick={() => window.ethereum.request({ method: "eth_requestAccounts" })}>
            Connect MetaMask
          </Button>
        )}
      </div>

      <Row className="justify-content-center">
        <Col md={6}>
          <CreateJobForm account={account} onJobCreated={handleJobUpdated} />
        </Col>
      </Row>

      <Row className="justify-content-center mt-4">
        <Col md={4}>
          <Dropdown>
            <Dropdown.Toggle variant="success" id="filter-dropdown">
              {filter}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => setFilter("All Jobs")}>All Jobs</Dropdown.Item>
              <Dropdown.Item onClick={() => setFilter("My Jobs")}>My Jobs</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Col>
      </Row>

      <Row className="justify-content-center mt-4">
        <Col md={8}>
          {loading ? (
            <Alert variant="info">Loading jobs...</Alert>
          ) : (
            <JobList jobs={jobs} account={account} onJobUpdated={handleJobUpdated} />
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default App;
