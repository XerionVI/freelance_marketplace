import React, { useState, useEffect } from "react";
import { Table, Button, Modal } from "react-bootstrap";
import AddJobDetailsForm from "./AddJobDetailsForm";
import axios from "axios";
import config from "../config"; // Import the config file

function JobListDB({ account, filter }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [jobDetails, setJobDetails] = useState(null);

  // Function to close the modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedJobId(null); // Reset the selected job ID
  };

  // Function to close the details modal
  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
    setJobDetails(null); // Reset the job details
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
      const token = localStorage.getItem("token");
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
              `${config.API_BASE_URL}/api/jobs/details/${job.jobId}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            return { ...job, hasDetails: true, details: detailsResponse.data };
          } catch (error) {
            console.warn(`No details found for jobId: ${job.jobId}`);
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
                {job.hasDetails ? (
                  <Button
                    variant="warning"
                    onClick={() => handleEditDetails(job.id || job.jobId)}
                    className="me-2"
                  >
                    Edit Details
                  </Button>
                ) : (
                  <Button
                    variant="info"
                    onClick={() => handleAddDetails(job.id || job.jobId)}
                    className="me-2"
                  >
                    Add Details
                  </Button>
                )}
                {job.hasDetails && (
                  <Button
                    variant="success"
                    onClick={() => handleShowDetails(job.id || job.jobId)}
                  >
                    Show Details
                  </Button>
                )}
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
          <AddJobDetailsForm jobId={selectedJobId} />
        </Modal.Body>
      </Modal>

      {/* Modal for Showing Job Details */}
      <Modal show={showDetailsModal} onHide={handleCloseDetailsModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Job Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {jobDetails ? (
            <div>
              <p><strong>Job Title:</strong> {jobDetails.jobTitle}</p>
              <p><strong>Description:</strong> {jobDetails.description}</p>
              <p><strong>Status:</strong> {jobDetails.status}</p>
            </div>
          ) : (
            <p>Loading job details...</p>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default JobListDB;