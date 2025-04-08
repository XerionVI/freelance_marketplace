import React, { useState, useEffect } from "react";
import { Button, Form, Alert } from "react-bootstrap";

function AddJobDetailsForm({ jobId, token }) {
  const [jobTitle, setJobTitle] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Status is fixed to "Submitted to work"
  const status = "Submitted to work";

  // Fetch job details if in edit mode
  useEffect(() => {
    const fetchJobDetails = async () => {
      if (!jobId) return; // Only fetch if jobId exists (edit mode)

      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found in localStorage");
          setMessage("Failed to fetch job details: User is not authenticated.");
          return;
        }

        const response = await fetch(`/api/jobs/details/${jobId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch job details");
        }

        const data = await response.json();
        setJobTitle(data.jobTitle);
        setDescription(data.description);
      } catch (error) {
        console.error("Error fetching job details:", error);
        setMessage("Error fetching job details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobDetails();
  }, [jobId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Prepare the payload
      const formData = {
        jobId, // Ensure jobId is passed correctly
        jobTitle,
        description,
        status,
      };

      // Retrieve the token from localStorage
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found in localStorage");
        setMessage("Failed to save job: User is not authenticated.");
        return;
      }

      // Determine whether to add or update job details
      const method = jobId ? "PUT" : "POST";
      const url = jobId ? "/api/jobs/details" : "/api/jobs/details";

      // Make the API call using fetch
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${jobId ? "update" : "save"} job details`);
      }

      // Handle success
      setMessage(`Job details ${jobId ? "updated" : "saved"} successfully!`);
      setJobTitle("");
      setDescription("");
    } catch (error) {
      console.error(`Error ${jobId ? "updating" : "saving"} job details:`, error);
      setMessage(`Error ${jobId ? "updating" : "saving"} job details.`);
    }
  };

  return (
    <div>
      <h5>{jobId ? "Edit Job Details" : "Add Job Details"}</h5>
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
            {jobId ? "Update Job Details" : "Save Job Details"}
          </Button>
        </Form>
      )}
    </div>
  );
}

export default AddJobDetailsForm;