import React, { useState, useEffect } from "react";
import { Table, Button, Modal } from "react-bootstrap";
import AddJobDetailsForm from "./AddJobDetailsForm";
import axios from "axios";
import config from "../config"; // Import the config file
import { useNavigate } from "react-router-dom"; // Import navigation hook

function JobListDB({ account, filter }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [jobDetails, setJobDetails] = useState(null);
  const navigate = useNavigate(); // Initialize navigation

  const token = localStorage.getItem("token"); // Retrieve the token once

  // Function to navigate to the Job Details page
  const handleShowDetails = (jobId) => {
    navigate(`/job-details/${jobId}`); // Navigate to the job details page
  };

  // Function to close the Add/Edit Job Details modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedJobId(null); // Reset the selected job ID
  };

  // Function to close the Show Job Details modal
  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
    setJobDetails(null); // Reset the job details
  };

  // Function to handle adding job details
  const handleAddDetails = (jobId) => {
    setSelectedJobId(jobId); // Set the selected job ID
    setShowModal(true); // Open the modal
  };

  // Function to handle editing job details
  const handleEditDetails = (jobId) => {
    setSelectedJobId(jobId); // Set the selected job ID
    setShowModal(true); // Open the modal
  };

  // Fetch jobs from the API
  const fetchJobs = async () => {
    setLoading(true);
    if (!account) {
      console.error("No wallet address found.");
      setLoading(false);
      return;
    }

    try {
      if (!token) {
        console.error("No token found in localStorage");
        setLoading(false);
        return;
      }

      console.log("Headers being sent:", {
        Authorization: `Bearer ${token}`,
        "Wallet-Address": account,
      });

      // Fetch jobs
      const response = await axios.get(`${config.API_BASE_URL}/api/jobs`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Wallet-Address": account, // Include the wallet address in the headers
        },
      });

      const jobsData = response.data;

      // Fetch job details for each job and add a `hasDetails` property
      const jobsWithDetails = await Promise.all(
        jobsData.map(async (job) => {
          try {
            const detailsResponse = await axios.get(
              `${config.API_BASE_URL}/api/jobs/details/${job.job_id}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            return { ...job, hasDetails: true, details: detailsResponse.data };
          } catch (error) {
            console.warn(`No details found for jobId: ${job.job_id}`);
            return { ...job, hasDetails: false };
          }
        })
      );

      console.log("Jobs fetched from backend:", jobsWithDetails); // Debugging log
      setJobs(jobsWithDetails);
    } catch (error) {
      console.error("Error fetching jobs from database:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("Account in JobListDB:", account); // Debug log
    fetchJobs();
  }, [account]);

  if (!account) {
    return <p>Please connect your wallet to view jobs.</p>;
  }

  if (loading) {
    return <p>Loading jobs...</p>;
  }

  if (jobs.length === 0) {
    return <p>No jobs found.</p>; // Handle empty job list
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
            <th>Amount (ETH)</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job, index) => (
            <tr key={job.job_id}>
              <td>{index + 1}</td>
              <td>{job.job_id}</td>
              <td>{job.client}</td>
              <td>{job.freelancer}</td>
              <td>{job.amount}</td>
              <td>{job.status}</td>
              <td>
                {job.hasDetails ? (
                  <Button
                    variant="warning"
                    onClick={() => handleEditDetails(job.job_id)}
                    className="me-2"
                  >
                    Edit Details
                  </Button>
                ) : (
                  <Button
                    variant="info"
                    onClick={() => handleAddDetails(job.job_id)}
                    className="me-2"
                  >
                    Add Details
                  </Button>
                )}
                <Button
                  variant="success"
                  onClick={() => handleShowDetails(job.job_id)}
                >
                  Show Details
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal for Add/Edit Job Details */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{selectedJobId ? "Edit Job Details" : "Add Job Details"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AddJobDetailsForm jobId={selectedJobId} token={token} account={account} />
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default JobListDB;