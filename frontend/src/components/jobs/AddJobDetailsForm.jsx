import React, { useState, useEffect } from "react";
import { Modal, Box, Typography, Button, TextField } from "@mui/material";
import axios from "axios";
import config from "../../config";

function AddJobDetailsForm({ open, onClose, jobId, existingDetails }) {
  const [jobTitle, setJobTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Populate the form fields when the modal opens or jobId changes
  useEffect(() => {
    if (open && existingDetails) {
      setJobTitle(existingDetails.title || ""); // Populate jobTitle
      setDescription(existingDetails.description || ""); // Populate description
    }
  }, [open, existingDetails]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found in localStorage");
        return;
      }

      const response = await axios.post(
        `${config.API_BASE_URL}/api/jobs/details`,
        {
          jobId,
          title: jobTitle,
          description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Job details saved successfully:", response.data);
      onClose(); // Close the modal after saving
    } catch (error) {
      console.error("Error saving job details:", error);
      alert("Failed to save job details. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" gutterBottom>
          {jobId ? `Edit Details for Job ID: ${jobId}` : "Add Job Details"}
        </Typography>
        <TextField
          fullWidth
          label="Job Title"
          variant="outlined"
          margin="normal"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
        />
        <TextField
          fullWidth
          label="Description"
          variant="outlined"
          margin="normal"
          multiline
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Box sx={{ textAlign: "right", mt: 2 }}>
          <Button onClick={onClose} sx={{ mr: 2 }} disabled={isSaving}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default AddJobDetailsForm;