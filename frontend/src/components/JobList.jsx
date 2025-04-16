import React, { useEffect, useState } from "react";
import { Table, Button, Alert } from "react-bootstrap";
import { ethers } from "ethers";
import { getFreelanceEscrowContract } from "../utils/getFreelanceEscrow";
import AddressDetails from "./AddressDetails";

function JobList({ account, filter }) {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("All Jobs");
  const [processingJobId, setProcessingJobId] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const contract = await getFreelanceEscrowContract(account);
      if (!contract) {
        console.error("Contract not initialized.");
        setLoading(false);
        return;
      }
  
      const jobIds = await contract.getAllJobIds(); // Fetch all job IDs
      const jobs = [];
  
      for (const jobId of jobIds) {
        const job = await contract.jobs(jobId);
        jobs.push({
          jobId: jobId.toString(), // Ensure jobId is stored as a string for consistency
          client: job.client,
          freelancer: job.freelancer,
          amount: ethers.formatEther(job.amount),
          status: job.status,
        });
      }
  
      setJobs(jobs);
    } catch (error) {
      console.error("Error fetching jobs from smart contract:", error);
    } finally {
      setLoading(false);
    }
  };

  // Apply filter whenever jobs, filter, or account changes
  useEffect(() => {
    const currentAccountAddress = account?.toLowerCase();
    if (!currentAccountAddress) return; // Ensure account is available

    const filtered = selectedFilter === "All Jobs"
      ? jobs
      : jobs.filter(
          (job) =>
            currentAccountAddress === job.client.toLowerCase() ||
            currentAccountAddress === job.freelancer.toLowerCase()
        );
    setFilteredJobs(filtered);
  }, [jobs, selectedFilter, account]);

  // Fetch jobs when the component mounts
  useEffect(() => {
    console.log("Account in JobList:", account); // Debug log
    fetchJobs();
  }, [account]);

  // Handle address click to show the address details
  const handleAddressClick = (address) => {
    setSelectedAddress(address);
  };

  if (loading) return <p>Loading jobs...</p>;

  if (jobs.length === 0) {
    return (
      <Alert variant="warning" className="text-center">
        No jobs found on the smart contract. Please create a job to get started.
      </Alert>
    );
  }

  return (
    <div className="table-responsive">
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
  {filteredJobs.map((job) => (
    <tr key={job.jobId}>
      <td>{job.jobId}</td>
      <td>
        <Button
          variant="link"
          className="p-0 text-decoration-underline"
          onClick={() => handleAddressClick(job.client)}
        >
          {job.client}
        </Button>
      </td>
      <td>
        <Button
          variant="link"
          className="p-0 text-decoration-underline"
          onClick={() => handleAddressClick(job.freelancer)}
        >
          {job.freelancer}
        </Button>
      </td>
      <td>{job.amount}</td>
      <td>{job.status}</td>
    </tr>
  ))}
</tbody>
</Table>
      {selectedAddress && (
        <AddressDetails
          address={selectedAddress}
          onClose={() => setSelectedAddress(null)}
        />
      )}
    </div>
  );
}

export default JobList;