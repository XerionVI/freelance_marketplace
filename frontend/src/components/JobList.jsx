import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { getFreelanceEscrowContract } from "../utils/getFreelanceEscrow";
import AddressDetails from "./AddressDetails";

function JobList({ account, filter, jobs, loading }) {
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("All Jobs");
  const [processingJobId, setProcessingJobId] = useState(null);

  // Apply filter whenever jobs, filter, or account changes
  useEffect(() => {
    const currentAccountAddress = account?.toLowerCase();

    const filtered = selectedFilter === "All Jobs"
      ? jobs
      : jobs.filter(
          (job) =>
            currentAccountAddress === job.client.toLowerCase() ||
            currentAccountAddress === job.freelancer.toLowerCase()
        );
    
    setFilteredJobs(filtered);
  }, [jobs, selectedFilter, account]);

  // Handle address click to show the address details
  const handleAddressClick = (address) => {
    setSelectedAddress(address);
  };

  // Handle actions for each job (Submit, Complete)
  const handleJobAction = async (jobId, action) => {
    try {
      setProcessingJobId(jobId);
      const contract = await getFreelanceEscrowContract(account);

      let tx;
      if (action === "submit") {
        tx = await contract.submitJob(jobId);
      } else if (action === "complete") {
        tx = await contract.completeJob(jobId);
      } else {
        console.error("Invalid action or missing jobId");
        return;
      }

      const receipt = await tx.wait();
      console.log(`Transaction successful with hash: ${receipt.transactionHash}`);
      alert(`Job ${jobId} ${action} action completed successfully!`);
    } catch (error) {
      console.error("Error processing job action:", error);
      alert(`Failed to perform ${action} on Job ${jobId}.`);
    } finally {
      setProcessingJobId(null);
    }
  };

  if (loading) return <p>Loading jobs...</p>;

  return (
    <div>
      <h5>Job List</h5>
      <table className="table">
        <thead>
          <tr>
            <th>Job ID</th>
            <th>Client</th>
            <th>Freelancer</th>
            <th>Amount (ETH)</th>
            <th>Status</th>
            <th>Transaction</th>
          </tr>
        </thead>
        <tbody>
          {filteredJobs.map((job) => (
            <tr key={job.jobId}>
              <td>{job.jobId}</td>
              <td>
                <button
                  type="button"
                  className="btn btn-link p-0 text-decoration-underline"
                  onClick={() => handleAddressClick(job.client)}
                  style={buttonStyle}
                >
                  {job.client}
                </button>
              </td>
              <td>
                <button
                  type="button"
                  className="btn btn-link p-0 text-decoration-underline"
                  onClick={() => handleAddressClick(job.freelancer)}
                  style={buttonStyle}
                >
                  {job.freelancer}
                </button>
              </td>
              <td>{job.amount}</td>
              <td>{job.status}</td>
              <td>
                <a
                  href={`https://etherscan.io/tx/${job.transactionHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Tx
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedAddress && (
        <AddressDetails
          address={selectedAddress}
          onClose={() => setSelectedAddress(null)}
        />
      )}
    </div>
  );
}

// Define button styles separately for reusability
const buttonStyle = {
  color: "blue",
  cursor: "pointer",
  background: "none",
  border: "none",
};

export default JobList;
