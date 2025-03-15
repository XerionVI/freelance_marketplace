import React, { useState, useEffect } from "react";
import { Container, Row, Col, Alert, Tab, Tabs } from "react-bootstrap";
import CreateJobForm from "./components/CreateJobForm";
import JobList from "./components/JobList";
import JobListDB from "./components/JobListDB";
import { ethers } from "ethers";
import { getFreelanceEscrowContract } from "./utils/getFreelanceEscrow";

function App() {
  const [account, setAccount] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All Jobs");

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
    if (!account) return;
    setLoading(true);
    try {
      const contract = await getFreelanceEscrowContract(account);
      const totalJobs = await contract.getTotalJobs();
      const jobDetails = [];
  
      for (let i = 0; i < totalJobs; i++) {
        const job = await contract.getJobDetails(i);
        const jobObj = {
          jobId: i,
          client: job.client,
          freelancer: job.freelancer,
          amount: ethers.formatEther(job.amount),
          status: job.status === 0 ? "Created" : job.status === 1 ? "Completed" : "Approved",
          blockNumber: 0, // Placeholder, you can fetch this if needed
          transactionHash: "", // Placeholder
        };
  
        jobDetails.push(jobObj);
      }
  
      setJobs(jobDetails);
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
  }, [account]);

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
            <Col md={8} className="mx-auto">
              <h3>Jobs on Smart Contract</h3>
              <JobList account={account} filter={filter} jobs={jobs} loading={loading} />

              <h3 className="mt-4">Jobs in the Database</h3>
              <JobListDB account={account} filter={filter} />
            </Col>
          </Row>
        </Tab>
      </Tabs>
    </Container>
  );
}

export default App;
