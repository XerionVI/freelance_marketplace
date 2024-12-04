import React, { useState } from "react";
import { Button, Form, Alert } from "react-bootstrap";
import axios from "axios";

function AddJobDetailsForm({ jobId }) {
  const [jobTitle, setJobTitle] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");

  // Status is fixed to "Submitted to work"
  const status = "Submitted to work";

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

      // Make the API call
      const response = await axios.post("/api/job-details", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Handle success
      setMessage("Job details saved successfully!");
      setJobTitle("");
      setDescription("");
    } catch (error) {
      console.error("Error saving job details:", error);
      setMessage("Error saving job details.");
    }
  };

  return (
    <div>
      <h5>Add Job Details</h5>
      {message && <Alert variant="info">{message}</Alert>}
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
          Save Job Details
        </Button>
      </Form>
    </div>
  );
}

export default AddJobDetailsForm;
