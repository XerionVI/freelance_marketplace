import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { getFreelanceEscrowContract } from "../utils/getFreelanceEscrow";
import AddressDetails from "./AddressDetails";

function JobList({ account }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAddress, setSelectedAddress] = useState(null);

  // Fetch jobs from the contract
  useEffect(() => {
    const fetchJobs = async () => {
      const contract = await getFreelanceEscrowContract(account);
      if (!contract) return;

      try {
        const totalJobs = await contract.getTotalJobs();
        const jobDetails = [];

        for (let i = 0; i < totalJobs; i++) {
          const job = await contract.getJobDetails(i);
          jobDetails.push({
            jobId: i,
            client: job.client,
            freelancer: job.freelancer,
            amount: ethers.formatEther(job.amount),
            status: job.status === 0 ? "Created" : job.status === 1 ? "Completed" : "Approved",
          });
        }

        setJobs(jobDetails);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        setLoading(false);
      }
    };

    fetchJobs();
  }, [account]);

  // Function to approve a job
  const approveJob = async (jobId) => {
    try {
      const contract = await getFreelanceEscrowContract(account);
      const tx = await contract.approveJob(jobId);
      await tx.wait();
      alert(`Job ${jobId} has been approved.`);

      setJobs((prevJobs) =>
        prevJobs.map((job) =>
          job.jobId === jobId ? { ...job, status: "Approved" } : job
        )
      );
    } catch (error) {
      console.error("Error approving job:", error);
      alert("Failed to approve the job.");
    }
  };

  // Function to mark a job as complete
  const markJobAsComplete = async (jobId) => {
    try {
      const contract = await getFreelanceEscrowContract(account);
      const tx = await contract.completeJob(jobId);
      await tx.wait();
      alert(`Job ${jobId} has been marked as completed.`);

      setJobs((prevJobs) =>
        prevJobs.map((job) =>
          job.jobId === jobId ? { ...job, status: "Completed" } : job
        )
      );
    } catch (error) {
      console.error("Error marking job as complete:", error);
      alert("Failed to mark the job as completed.");
    }
  };

  // Display address details modal
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
            <th>Actions</th> {/* Dedicated Actions column */}
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
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
              <td>
                {job.status === "Created" && (
                  <button
                    onClick={() => approveJob(job.jobId)}
                    className="btn btn-success btn-sm"
                  >
                    Approve
                  </button>
                )}
                {job.status === "Approved" && (
                  <button
                    onClick={() => markJobAsComplete(job.jobId)}
                    className="btn btn-primary btn-sm"
                  >
                    Mark Complete
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
          onClose={() => setSelectedAddress(null)}
        />
      )}
    </div>
  );
}

export default JobList;
