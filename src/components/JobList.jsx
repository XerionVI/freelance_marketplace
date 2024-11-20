import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { getFreelanceEscrowContract } from "../utils/getFreelanceEscrow";
import AddressDetails from "./AddressDetails"; // Re-import AddressDetails

function JobList({ account, filter, jobs, loading }) {
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null); // Store selected address

  // Apply filter whenever jobs or filter changes
  useEffect(() => {
    if (filter === "All Jobs") {
      setFilteredJobs(jobs);
    } else {
      const currentAccountAddress = account.toLowerCase();
      setFilteredJobs(
        jobs.filter(
          (job) =>
            currentAccountAddress === job.client.toLowerCase() ||
            currentAccountAddress === job.freelancer.toLowerCase()
        )
      );
    }
  }, [jobs, filter, account]);

  // Handle address click to show the address details
  const handleAddressClick = (address) => {
    setSelectedAddress(address);
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
                  onClick={() => handleAddressClick(job.client)} // Handle client address click
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
                  onClick={() => handleAddressClick(job.freelancer)} // Handle freelancer address click
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
                {/* Action buttons can go here */}
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
