import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import axios from "axios";

function JobListFreelance({ account }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch jobs for the logged-in freelancer from the API
  const fetchJobs = async () => {
    setLoading(true);
    const token = localStorage.getItem("token"); // Retrieve the token from localStorage
    if (!token) {
      console.error("No token found in localStorage");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get("http://localhost:5000/api/jobs/freelancer", {
        headers: { Authorization: `Bearer ${token}` }, // Include the token in the Authorization header
      });
      console.log("Jobs fetched for freelancer from backend:", response.data); // Debugging log
      setJobs(response.data);
    } catch (error) {
      console.error("Error fetching jobs for freelancer from database:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch jobs when the component mounts
  useEffect(() => {
    fetchJobs();
  }, [account]);

  if (loading) {
    return <p>Loading jobs...</p>;
  }

  if (jobs.length === 0) {
    return <p>No jobs found for this freelancer.</p>; // Handle empty job list
  }

  return (
    <div className="table-responsive">
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Job ID</th>
            <th>Client</th>
            <th>Freelancer</th>
            <th>Amount</th>
            <th>Block Number</th>
            <th>Transaction Hash</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job, index) => (
            <tr key={job.id || job.jobId}>
              <td>{index + 1}</td>
              <td>{job.id || job.jobId}</td>
              <td>{job.client}</td>
              <td>{job.freelancer}</td>
              <td>{job.amount}</td>
              <td>{job.blockNumber}</td>
              <td>{job.transactionHash}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default JobListFreelance;