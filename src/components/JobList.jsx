import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { getFreelanceEscrowContract } from "../utils/getFreelanceEscrow";

function JobList({ account }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

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
            amount: ethers.formatEther(job.amount), // Convert amount from Wei to Ether
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
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr key={job.jobId}>
              <td>{job.jobId}</td>
              <td>{job.client}</td>
              <td>{job.freelancer}</td>
              <td>{job.amount}</td>
              <td>{job.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default JobList;
