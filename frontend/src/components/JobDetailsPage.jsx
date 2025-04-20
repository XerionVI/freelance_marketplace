import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button, Form, Alert, Table } from "react-bootstrap";
import axios from "axios";
import config from "../config";

function JobDetailsPage({ account, token }) {
  const { jobId } = useParams(); // Get jobId from the URL
  const [jobDetails, setJobDetails] = useState(null);
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [jobFiles, setJobFiles] = useState([]); // State to store uploaded files

  // Fetch job details
  useEffect(() => {
    const fetchJobDetails = async () => {
      if (!jobId || !account || !token) {
        setMessage("Missing required information to fetch job details.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${config.API_BASE_URL}/api/jobs/${jobId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Wallet-Address": account,
          },
        });

        if (response.status === 200) {
          setJobDetails(response.data);
        } else {
          setMessage("Failed to fetch job details.");
        }
      } catch (error) {
        console.error("Error fetching job details:", error);
        setMessage("Error fetching job details.");
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
          setJobFiles(response.data); // Set the uploaded files
        } else {
          setMessage("Failed to fetch job files.");
        }
      } catch (error) {
        console.error("Error fetching job files:", error);
        setMessage("Error fetching job files.");
      }
    };

    fetchJobDetails();
    fetchJobFiles();
  }, [jobId, account, token]);

  // Handle file upload
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
        setJobFiles((prevFiles) => [...prevFiles, response.data]); // Add the new file to the list
      } else {
        setMessage("Failed to upload file.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setMessage("Error uploading file.");
    }
  };

  if (isLoading) {
    return <p>Loading job details...</p>;
  }

  if (!jobDetails) {
    return <p>{message || "No job details found."}</p>;
  }

  return (
    <div>
      <h3>Job Details</h3>
      <div>
        <p><strong>Job ID:</strong> {jobDetails.job_id}</p>
        <p><strong>Client:</strong> {jobDetails.client}</p>
        <p><strong>Freelancer:</strong> {jobDetails.freelancer}</p>
        <p><strong>Amount:</strong> {jobDetails.amount} ETH</p>
        <p><strong>Status:</strong> {jobDetails.status}</p>
        <p><strong>Job Title:</strong> {jobDetails.jobTitle || "N/A"}</p>
        <p><strong>Description:</strong> {jobDetails.description || "N/A"}</p>
      </div>

      <h4>Uploaded Files</h4>
      {jobFiles.length > 0 ? (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>File Name</th>
              <th>Uploaded By</th>
              <th>Uploaded At</th>
            </tr>
          </thead>
          <tbody>
            {jobFiles.map((file, index) => (
              <tr key={file.file_id}>
                <td>{index + 1}</td>
                <td>{file.file_name}</td>
                <td>{file.uploaded_by}</td>
                <td>{new Date(file.uploaded_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p>No files uploaded for this job.</p>
      )}

      <h4>Upload File</h4>
      {message && <Alert variant="info">{message}</Alert>}
      <Form onSubmit={handleFileUpload}>
        <Form.Group controlId="fileUpload">
          <Form.Label>Select File</Form.Label>
          <Form.Control
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </Form.Group>
        <Button variant="primary" type="submit" className="mt-3">
          Upload File
        </Button>
      </Form>
    </div>
  );
}

export default JobDetailsPage;