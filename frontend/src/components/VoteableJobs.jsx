import React, { useState, useEffect } from "react";
import { Table, Button } from "react-bootstrap";
import axios from "axios";

function VoteableJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [votedJobs, setVotedJobs] = useState([]); // Track jobs the user has voted for

  const fetchVoteableJobs = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found in localStorage");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get("http://localhost:5000/api/jobs/voteable", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobs(response.data);

      // Fetch jobs the user has already voted for
      const votedResponse = await axios.get("http://localhost:5000/api/votes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVotedJobs(votedResponse.data.map((vote) => vote.jobId));
    } catch (error) {
      console.error("Error fetching voteable jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const castVote = async (jobId, voteFor) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found in localStorage");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/jobs/vote",
        { jobId, voteFor },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Vote cast successfully!");
      fetchVoteableJobs(); // Refresh the job list
    } catch (error) {
      console.error("Error casting vote:", error);
      alert(error.response?.data || "Error casting vote.");
    }
  };

  useEffect(() => {
    fetchVoteableJobs();
  }, []);

  if (loading) {
    return <p>Loading voteable jobs...</p>;
  }

  if (jobs.length === 0) {
    return <p>No voteable jobs found.</p>;
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
            <th>Actions</th>
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
              <td>
                {votedJobs.includes(job.id || job.jobId) ? (
                  <span>Already Voted</span>
                ) : (
                  <>
                    <Button
                      variant="success"
                      className="me-2"
                      onClick={() => castVote(job.id || job.jobId, "client")}
                    >
                      Vote Client
                    </Button>
                    <Button
                      variant="primary"
                      onClick={() => castVote(job.id || job.jobId, "freelancer")}
                    >
                      Vote Freelancer
                    </Button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default VoteableJobs;