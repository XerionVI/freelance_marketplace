import React, { useState, useEffect } from "react";
import { Table, Button, Modal } from "react-bootstrap";
import axios from "axios";
import AddJobDetailsForm from "./AddJobDetailsForm";

function JobListDB({ account, filter }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);

  // Fetch jobs from the API
  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/jobs"); // Ensure your API returns the job details
      setJobs(response.data);
    } catch (error) {
      console.error("Error fetching jobs from database:", error);
    }
    setLoading(false);
  };

  const handleAddDetails = (jobId) => {
    setSelectedJobId(jobId);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedJobId(null);
  };

  // Fetch jobs when the component mounts
  useEffect(() => {
    fetchJobs();
  }, []);

  if (loading) {
    return <p>Loading jobs...</p>;
  }

  return (
    <div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Job ID</th> {/* New column for jobId */}
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
            <tr key={job.jobId}>
              <td>{index + 1}</td>
              <td>{job.jobId}</td> {/* Display jobId */}
              <td>{job.client}</td>
              <td>{job.freelancer}</td>
              <td>{job.amount}</td>
              <td>{job.blockNumber}</td>
              <td>{job.transactionHash}</td>
              <td>
                <Button
                  variant="info"
                  onClick={() => handleAddDetails(job.jobId)}
                >
                  Add Details
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal for AddJobDetailsForm */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Job Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AddJobDetailsForm jobId={selectedJobId} />
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default JobListDB;
