import React, { useEffect, useState } from "react";
import { Container, Row, Col, Alert, Button, Table, Dropdown } from "react-bootstrap";
import CreateJobForm from "./components/CreateJobForm";
import "bootstrap/dist/css/bootstrap.min.css";
import { ethers } from "ethers";
import { getFreelanceEscrowContract } from "./utils/getFreelanceEscrow"; // Add this utility to connect to your contract

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
          // Request account access if needed
          const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
          console.log("Connected account:", accounts[0]);
          setAccount(accounts[0]);

          // Listen for account changes
          window.ethereum.on("accountsChanged", (accounts) => {
            setAccount(accounts[0] || null);
          });
        } catch (error) {
          console.error("User denied account access or an error occurred.");
          alert("Error connecting to MetaMask.");
        }
      } else {
        alert("MetaMask is not installed. Please install it to use this app.");
      }
    };

    connectWallet();
  }, []);

  // Fetch jobs from the contract with optional filtering
  const fetchJobs = async () => {
    if (!account) return;
    setLoading(true);
    try {
      const contract = await getFreelanceEscrowContract(account);
      const totalJobs = await contract.getTotalJobs();
      const jobDetails = [];

      // Convert the account address to lowercase for case-insensitive comparison
      const currentAccountAddress = account.toLowerCase();

      // Fetch job details for each jobId
      for (let i = 0; i < totalJobs; i++) {
        const job = await contract.getJobDetails(i);
        const jobObj = {
          jobId: i,
          client: job.client,
          freelancer: job.freelancer,
          amount: ethers.formatEther(job.amount), // Convert from Wei to Ether
          status: job.status === 0 ? "Created" : job.status === 1 ? "Completed" : "Approved",
        };

        // Filter jobs based on "My Jobs" or "All Jobs"
        if (filter === "All Jobs" || 
            currentAccountAddress === job.client.toLowerCase() || 
            currentAccountAddress === job.freelancer.toLowerCase()) {
          jobDetails.push(jobObj);
        }
      }
      setJobs(jobDetails);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
    setLoading(false);
  };

  // Call fetchJobs on page load, when account changes, or when filter changes
  useEffect(() => {
    fetchJobs();
  }, [account, filter]);

  // Callback to trigger fetching jobs after creating a job
  const handleJobCreated = () => {
    fetchJobs(); // Refresh job list after creating a job
  };

  return (
    <Container className="mt-5">
      <h1 className="text-center mb-4">Freelance Marketplace</h1>

      {/* Display user account if connected */}
      <div className="text-center mb-4">
        {account ? (
          <Alert variant="info">Connected as: {account}</Alert>
        ) : (
          <Button onClick={() => window.ethereum.request({ method: "eth_requestAccounts" })}>
            Connect MetaMask
          </Button>
        )}
      </div>

      {/* Row for Components */}
      <Row className="justify-content-center">
        <Col md={6}>
          <CreateJobForm account={account} onJobCreated={handleJobCreated} />
        </Col>
      </Row>

      {/* Filter Dropdown */}
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

      {/* Job List */}
      <Row className="justify-content-center mt-4">
        <Col md={8}>
          {loading ? (
            <Alert variant="info">Loading jobs...</Alert>
          ) : (
            <div>
              <h5>Job List</h5>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Job ID</th>
                    <th>Client</th>
                    <th>Freelancer</th>
                    <th>Amount (ETH)</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center">No jobs found.</td>
                    </tr>
                  ) : (
                    jobs.map((job) => (
                      <tr key={job.jobId}>
                        <td>{job.jobId}</td>
                        <td>{job.client}</td>
                        <td>{job.freelancer}</td>
                        <td>{job.amount}</td>
                        <td>{job.status}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default App;
