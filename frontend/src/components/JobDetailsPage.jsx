import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Alert,
  CircularProgress,
  Paper,
  TextField,
} from "@mui/material";
import axios from "axios";
import config from "../config";
import NotesModal from "./NotesModal"; // Import the NotesModal component
import { ethers } from "ethers";
import { getFreelanceEscrowContract } from "../utils/getFreelanceEscrow";

function JobDetailsPage({ account, token }) {
  const { jobId } = useParams();
  const [jobDetails, setJobDetails] = useState(null);
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [jobFiles, setJobFiles] = useState([]);
  const [selectedFileId, setSelectedFileId] = useState(null);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [showNotesModal, setShowNotesModal] = useState(false);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await axios.get(`${config.API_BASE_URL}/api/jobs/${jobId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Wallet-Address": account,
          },
        });

        if (response.status === 200) {
          setJobDetails(response.data);
        }
      } catch (error) {
        console.error("Error fetching job details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchJobFiles = async () => {
      try {
        const response = await axios.get(`${config.API_BASE_URL}/api/files/${jobId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Wallet-Address": account,
          },
        });

        if (response.status === 200) {
          setJobFiles(response.data);
        }
      } catch (error) {
        console.error("Error fetching job files:", error);
      }
    };

    fetchJobDetails();
    fetchJobFiles();
  }, [jobId, account, token]);

  const handleFileUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      setMessage("Please select a file to upload.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("uploadedBy", account === jobDetails.client ? "Client" : "Freelancer");

      const response = await axios.post(`${config.API_BASE_URL}/api/files/upload/${jobId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Wallet-Address": account,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        setMessage("File uploaded successfully!");
        setJobFiles((prevFiles) => [...prevFiles, response.data]);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handleShowNotes = async (fileId) => {
    setSelectedFileId(fileId);
    setShowNotesModal(true);

    try {
      const response = await axios.get(`${config.API_BASE_URL}/api/notes/${fileId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setNotes(response.data);
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;

    const addedBy = account === jobDetails.client ? "Client" : "Freelancer";

    try {
      const response = await axios.post(
        `${config.API_BASE_URL}/api/notes/${selectedFileId}`,
        { note: newNote, addedBy },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setNotes((prevNotes) => [
          ...prevNotes,
          { note: newNote, added_by: addedBy, added_at: new Date() },
        ]);
        setNewNote("");
      }
    } catch (error) {
      console.error("Error adding note:", error);
    }
  };

  const handleCompleteJob = async () => {
    setIsLoading(true);
    setMessage("");
    try {
      const contract = await getFreelanceEscrowContract(account);
      const tx = await contract.completeJob(jobId);
      await tx.wait();
      setMessage("Job marked as completed successfully!");
    } catch (error) {
      console.error("Error completing job:", error);
      setMessage("Error completing job. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveJob = async (jobId) => {
    setIsLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum); // Use BrowserProvider
      const signer = await provider.getSigner(); // Get the signer from the connected wallet
      const contract = new ethers.Contract(contractAddress, FreelanceEscrowABI, signer);
  
      console.log("Approving job with ID:", jobId);
      const tx = await contract.approveJob(jobId); // Call the approveJob function
      await tx.wait(); // Wait for the transaction to be mined
  
      alert("Job approved and payment released successfully!");
    } catch (error) {
      console.error("Error approving job:", error);
      alert("Error approving job. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Loading job details...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Job Details
      </Typography>
      <Box sx={{ mb: 4 }}>
        <Typography variant="body1"><strong>Job ID:</strong> {jobDetails.job_id}</Typography>
        <Typography variant="body1"><strong>Client:</strong> {jobDetails.client}</Typography>
        <Typography variant="body1"><strong>Freelancer:</strong> {jobDetails.freelancer}</Typography>
        <Typography variant="body1"><strong>Amount:</strong> {jobDetails.amount} ETH</Typography>
        <Typography variant="body1"><strong>Status:</strong> {jobDetails.status}</Typography>
        <Typography variant="body1"><strong>Job Title:</strong> {jobDetails.jobTitle || "N/A"}</Typography>
        <Typography variant="body1"><strong>Description:</strong> {jobDetails.description || "N/A"}</Typography>
      </Box>
      {/* Buttons for Complete and Approve Job */}
      <Box sx={{ mt: 4 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleCompleteJob}
          disabled={isLoading}
          sx={{ mr: 2 }}
        >
          {isLoading ? <CircularProgress size={24} /> : "Complete Job"}
        </Button>
        <Button
          variant="contained"
          color="success"
          onClick={handleApproveJob}
          disabled={isLoading}
        >
          {isLoading ? <CircularProgress size={24} /> : "Approve Job"}
        </Button>
      </Box>
      {/* Display Success or Error Message */}
      {message && (
        <Alert severity={message.includes("Error") ? "error" : "success"} sx={{ mt: 3 }}>
          {message}
        </Alert>
      )}
      <Typography variant="h5" gutterBottom>
        Uploaded Files
      </Typography>
      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>File Name</TableCell>
              <TableCell>Uploaded By</TableCell>
              <TableCell>Uploaded At</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {jobFiles.map((file, index) => (
              <TableRow key={file.file_id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{file.file_name}</TableCell>
                <TableCell>{file.uploaded_by}</TableCell>
                <TableCell>{new Date(file.uploaded_at).toLocaleString()}</TableCell>
                <TableCell>
                  <Button variant="outlined" color="primary" onClick={() => handleShowNotes(file.file_id)}>
                    View Notes
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography variant="h5" gutterBottom>
        Upload File
      </Typography>
      {message && <Alert severity="info" sx={{ mb: 2 }}>{message}</Alert>}
      <Box component="form" onSubmit={handleFileUpload} sx={{ mb: 4 }}>
        <TextField
          type="file"
          fullWidth
          onChange={(e) => setFile(e.target.files[0])}
          sx={{ mb: 2 }}
        />
        <Button variant="contained" color="primary" type="submit">
          Upload File
        </Button>
      </Box>

      {/* Notes Modal */}
      <NotesModal
        show={showNotesModal}
        onHide={() => setShowNotesModal(false)}
        notes={notes}
        newNote={newNote}
        setNewNote={setNewNote}
        handleAddNote={handleAddNote}
      />
    </Box>
  );
}

export default JobDetailsPage;