import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { getFreelanceEscrowContract } from "../utils/getFreelanceEscrow";
import AddressDetails from "./AddressDetails";

function JobList({ account, filter, jobs, loading }) {
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null); // Store selected address
  const [selectedFilter, setSelectedFilter] = useState("All Jobs");
  const [processingJobId, setProcessingJobId] = useState(null); // Track the job being processed

  // Apply filter whenever jobs, filter, or account changes
  useEffect(() => {
    if (selectedFilter === "All Jobs") {
      setFilteredJobs(jobs);
    } else {
      const currentAccountAddress = account?.toLowerCase();
      setFilteredJobs(
        jobs.filter(
          (job) =>
            currentAccountAddress === job.client.toLowerCase() ||
            currentAccountAddress === job.freelancer.toLowerCase()
        )
      );
    }
  }, [jobs, selectedFilter, account]);

  // Handle address click to show the address details
  const handleAddressClick = (address) => {
    setSelectedAddress(address);
  };

  // Handle actions for each job (Submit, Complete)
  const handleJobAction = async (jobId, action) => {
    try {
      setProcessingJobId(jobId); // Set the job as processing
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

      // Wait for the transaction to be mined
      const receipt = await tx.wait();
      console.log(`Transaction successful with hash: ${receipt.transactionHash}`);

      // Optionally refresh the jobs list or update state
      alert(`Job ${jobId} ${action} action completed successfully!`);
    } catch (error) {
      console.error("Error processing job action:", error);
      alert(`Failed to perform ${action} on Job ${jobId}.`);
    } finally {
      setProcessingJobId(null); // Reset processing state
    }
  };

  if (loading) {
    return <p>Loading jobs...</p>;
  }

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
            <th>Block</th>
            <th>Transaction</th>
            <th>Actions</th>
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
                  style={{
                    color: "blue",
                    cursor: "pointer",
                    background: "none",
                    border: "none",
                  }}
                >
                  {job.client}
                </button>
              </td>
              <td>
                <button
                  type="button"
                  className="btn btn-link p-0 text-decoration-underline"
                  onClick={() => handleAddressClick(job.freelancer)}
                  style={{
                    color: "blue",
                    cursor: "pointer",
                    background: "none",
                    border: "none",
                  }}
                >
                  {job.freelancer}
                </button>
              </td>
              <td>{job.amount}</td>
              <td>{job.status}</td>
              <td>{job.blockNumber}</td>
              <td>
                <a
                  href={`https://etherscan.io/tx/${job.transactionHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Tx
                </a>
              </td>
              <td>
                {job.status === "Approved" &&
                  job.freelancer.toLowerCase() === account.toLowerCase() && (
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => handleJobAction(job.jobId, "submit")}
                      disabled={processingJobId === job.jobId}
                    >
                      {processingJobId === job.jobId ? "Processing..." : "Submit"}
                    </button>
                  )}
                {job.status === "Submitted" &&
                  job.client.toLowerCase() === account.toLowerCase() && (
                    <button
                      className="btn btn-success btn-sm me-2"
                      onClick={() => handleJobAction(job.jobId, "complete")}
                      disabled={processingJobId === job.jobId}
                    >
                      {processingJobId === job.jobId ? "Processing..." : "Complete"}
                    </button>
                  )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedAddress && (
        <AddressDetails
          address={selectedAddress}
          onClose={() => setSelectedAddress(null)} // Close the address details modal
        />
      )}
    </div>
  );
}

export default JobList;
