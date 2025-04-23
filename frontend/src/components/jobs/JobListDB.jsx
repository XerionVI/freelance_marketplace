import React, { useState, useEffect } from "react";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  CircularProgress,
  Typography,
  Paper,
  Alert,
} from "@mui/material";
import AddJobDetailsForm from "./AddJobDetailsForm"; // Ensure this component is imported
import axios from "axios";
import config from "../../config";
import { useNavigate } from "react-router-dom";

function JobListDB({ account, filter }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const handleShowDetails = (jobId) => {
    navigate(`/job-details/${jobId}`);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedJobId(null);
  };

  const handleAddDetails = (jobId) => {
    setSelectedJobId(jobId);
    setShowModal(true);
  };

  const handleEditDetails = (jobId) => {
    setSelectedJobId(jobId);
    setShowModal(true);
  };

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

      const response = await axios.get(`${config.API_BASE_URL}/api/jobs`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Wallet-Address": account,
        },
      });

      const jobsData = response.data;

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

      setJobs(jobsWithDetails);
    } catch (error) {
      console.error("Error fetching jobs from database:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [account]);

  if (!account) {
    return <Alert severity="warning">Please connect your wallet to view jobs.</Alert>;
  }

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Loading jobs...
        </Typography>
      </div>
    );
  }

  if (jobs.length === 0) {
    return <Alert severity="info">No jobs found.</Alert>;
  }

  return (
    <>
      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, textAlign: "center" }}>
          Job List
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Job ID</TableCell>
              <TableCell>Client</TableCell>
              <TableCell>Freelancer</TableCell>
              <TableCell>Amount (ETH)</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {jobs.map((job, index) => (
              <TableRow key={job.job_id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{job.job_id}</TableCell>
                <TableCell>{job.client}</TableCell>
                <TableCell>{job.freelancer}</TableCell>
                <TableCell>{job.amount}</TableCell>
                <TableCell>{job.status}</TableCell>
                <TableCell>
                  {/* Show Details button accessible by both client and freelancer */}
                  {(job.client.toLowerCase() === account.toLowerCase() ||
                    job.freelancer.toLowerCase() === account.toLowerCase()) && (
                      <Button
                        variant="contained"
                        color="success"
                        onClick={() => handleShowDetails(job.job_id)}
                        sx={{ mr: 1 }}
                      >
                        Show Details
                      </Button>
                    )}

                  {/* Add/Edit Details buttons accessible only by the client */}
                  {job.client.toLowerCase() === account.toLowerCase() && (
                    <>
                      {job.hasDetails ? (
                        <Button
                          variant="outlined"
                          color="warning"
                          onClick={() => handleEditDetails(job.job_id)}
                          sx={{ mr: 1 }}
                        >
                          Edit Details
                        </Button>
                      ) : (
                        <Button
                          variant="outlined"
                          color="info"
                          onClick={() => handleAddDetails(job.job_id)}
                          sx={{ mr: 1 }}
                        >
                          Add Details
                        </Button>
                      )}
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal for Adding/Editing Job Details */}
      {showModal && (
        <AddJobDetailsForm
          open={showModal}
          onClose={handleCloseModal}
          jobId={selectedJobId}
          existingDetails={
            jobs.find((job) => job.job_id === selectedJobId)?.details || {}
          }
        />
      )}
    </>
  );
}

export default JobListDB;