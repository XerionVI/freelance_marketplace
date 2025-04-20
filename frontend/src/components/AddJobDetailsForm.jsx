import React, { useState, useEffect } from "react";
import { Button, Form, Alert } from "react-bootstrap";
import config from "../config"; // Import the config file

function AddJobDetailsForm({ account, jobId, token }) {
  const [jobTitle, setJobTitle] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false); // Track whether it's edit mode

  // Fetch job details if in edit mode
  useEffect(() => {
    const fetchJobDetails = async () => {
      if (!jobId || !account) return; // Only fetch if jobId and account exist

      setIsLoading(true);
      try {
        if (!token) {
          console.error("Authentication token missing.");
          setMessage("Failed to fetch job details: User is not authenticated.");
          setIsLoading(false);
          return;
        }

        console.log("Fetching job details with:", { jobId, token, account });

        // Fetch job details from the backend
        const response = await fetch(`${config.API_BASE_URL}/api/jobs/details/${jobId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "Wallet-Address": account, // Pass the account as a header
          },
        });

        if (response.ok) {
          const data = await response.json();
          setJobTitle(data.jobTitle || "");
          setDescription(data.description || "");
          setIsEditMode(true); // Switch to edit mode if data exists
        } else {
          console.warn("No job details found, switching to add mode.");
          setIsEditMode(false); // Switch to add mode if no data is found
        }
      } catch (error) {
        console.error("Error fetching job details:", error);
        setMessage("Error fetching job details.");
        setIsEditMode(false); // Default to add mode on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobDetails();
  }, [jobId, token, account]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!token || !account) {
        console.error("Authentication token or account missing.");
        setMessage("Failed to save job details: User is not authenticated.");
        return;
      }

      console.log("Submitting job details with:", { jobId, jobTitle, description, token, account });

      // Prepare the payload
      const formData = {
        jobId,
        title: jobTitle,
        description,
      };

      // Determine whether to add or update job details
      const method = isEditMode ? "PUT" : "POST";
      const url = `${config.API_BASE_URL}/api/jobs/details`;

      // Make the API call
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "Wallet-Address": account, // Pass the account as a header
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${isEditMode ? "update" : "save"} job details`);
      }

      setMessage(`Job details ${isEditMode ? "updated" : "saved"} successfully!`);
      setIsEditMode(true); // Switch to edit mode after saving
    } catch (error) {
      console.error(`Error ${isEditMode ? "updating" : "saving"} job details:`, error);
      setMessage(`Error ${isEditMode ? "updating" : "saving"} job details.`);
    }
  };

  return (
    <div>
      <h5>{isEditMode ? "Edit Job Details" : "Add Job Details"}</h5>
      {message && <Alert variant="info">{message}</Alert>}
      {isLoading ? (
        <p>Loading job details...</p>
      ) : (
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="jobTitle">
            <Form.Label>Job Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter job title"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="description">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter job description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="mt-3">
            {isEditMode ? "Update Job Details" : "Save Job Details"}
          </Button>
        </Form>
      )}
    </div>
  );
}

export default AddJobDetailsForm;