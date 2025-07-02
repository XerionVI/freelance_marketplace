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
  const [selectedJobDetails, setSelectedJobDetails] = useState({});
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const handleShowDetails = (jobId) => {
    navigate(`/job-details/${jobId}`);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedJobId(null);
    setSelectedJobDetails({});
  };

  const handleAddDetails = (jobId, details) => {
    setSelectedJobId(jobId);
    setSelectedJobDetails(details || {});
    setShowModal(true);
  };

  const handleEditDetails = (jobId, details) => {
    setSelectedJobId(jobId);
    setSelectedJobDetails(details || {});
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
      console.log("Jobs fetched from database:", response.data);
      setJobs(Array.isArray(response.data) ? response.data : []);
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
    return (
      <Alert severity="warning">Please connect your wallet to view jobs.</Alert>
    );
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
              <TableCell>Contract Job ID</TableCell>
              <TableCell>Client</TableCell>
              <TableCell>Freelancer</TableCell>
              <TableCell>Amount (ETH)</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Deadline</TableCell>
              <TableCell>Delivery Format</TableCell>
              <TableCell>Timezone</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {jobs.map((job, index) => (
              <TableRow key={job.job_id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{job.job_id}</TableCell>
                <TableCell>{job.contractJobId ?? "-"}</TableCell>
                <TableCell>{job.client}</TableCell>
                <TableCell>{job.freelancer}</TableCell>
                <TableCell>{job.amount}</TableCell>
                <TableCell>{job.status}</TableCell>
                <TableCell>{job.title || "-"}</TableCell>
                <TableCell>{job.category_id || "-"}</TableCell>
                <TableCell>{job.deadline || "-"}</TableCell>
                <TableCell>{job.delivery_format || "-"}</TableCell>
                <TableCell>{job.timezone || "-"}</TableCell>
                <TableCell>
                  {(job.client?.toLowerCase() === account.toLowerCase() ||
                    job.freelancer?.toLowerCase() ===
                      account.toLowerCase()) && (
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => handleShowDetails(job.job_id)}
                      sx={{ mr: 1 }}
                    >
                      Show Details
                    </Button>
                  )}

                  {job.client?.toLowerCase() === account.toLowerCase() && (
                    <>
                      {job.job_details_id ? (
                        <Button
                          variant="outlined"
                          color="warning"
                          onClick={() => handleEditDetails(job.job_id, job)}
                          sx={{ mr: 1 }}
                        >
                          Edit Details
                        </Button>
                      ) : (
                        <Button
                          variant="outlined"
                          color="info"
                          onClick={() => handleAddDetails(job.job_id, job)}
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
          existingDetails={selectedJobDetails}
        />
      )}
    </>
  );
}

export default JobListDB;
