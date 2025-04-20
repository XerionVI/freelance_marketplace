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