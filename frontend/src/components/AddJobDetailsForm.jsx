import React, { useState, useEffect } from "react";
import { Modal, Box, Typography, Button, TextField } from "@mui/material";

function AddJobDetailsForm({ open, onClose, jobId, existingDetails }) {
  const [jobTitle, setJobTitle] = useState("");
  const [description, setDescription] = useState("");

  // Populate the form fields when the modal opens or jobId changes
  useEffect(() => {
    if (open && existingDetails) {
      setJobTitle(existingDetails.title || ""); // Populate jobTitle
      setDescription(existingDetails.description || ""); // Populate description
    }
  }, [open, existingDetails]);

  const handleSave = () => {
    // Logic to save job details
    console.log("Saving details for jobId:", jobId, { jobTitle, description });
    onClose();
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
          <Button onClick={onClose} sx={{ mr: 2 }}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" onClick={handleSave}>
            Save
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default AddJobDetailsForm;