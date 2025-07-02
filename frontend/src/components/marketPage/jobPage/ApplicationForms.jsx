import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  CircularProgress,
  Alert,
  Stack,
} from "@mui/material";
import config from "../../../config";
import { jwtDecode } from "jwt-decode";

export default function ApplicationForms({
  open,
  onClose,
  listing,
  account,
  token,
  onApplied,
  editMode = false,
  initialValues = {},
  applicationId = null,
}) {
  const [coverLetter, setCoverLetter] = useState("");
  const [proposedAmount, setProposedAmount] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    setCoverLetter(initialValues.cover_letter || "");
    setProposedAmount(initialValues.proposed_amount || "");
    setAttachment(null);
  }, [initialValues, open]);

  const handleFileChange = (e) => {
    setAttachment(e.target.files[0]);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    if (!proposedAmount) {
      setError("Please enter your proposed amount.");
      setLoading(false);
      return;
    }
    try {
      // Decode token to get user id
      const decoded = jwtDecode(token);
      const user_id = decoded?.user?.id;
      if (!user_id) {
        setError("Could not determine user ID from token.");
        setLoading(false);
        return;
      }

      let response;
      if (editMode && applicationId) {
        // Edit mode: PUT request
        const formData = new FormData();
        formData.append("cover_letter", coverLetter);
        formData.append("proposed_amount", proposedAmount);
        if (attachment) formData.append("attachment", attachment);

        response = await fetch(`${config.API_BASE_URL}/api/applications/${applicationId}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Wallet-Address": account,
          },
          body: formData,
        });
      } else {
        // Create mode: POST request
        const formData = new FormData();
        formData.append("listing_id", listing.listing_id);
        formData.append("freelancer_address", account);
        formData.append("cover_letter", coverLetter);
        formData.append("proposed_amount", proposedAmount);
        formData.append("user_id", user_id); // use decoded user id
        if (attachment) formData.append("attachment", attachment);

        response = await fetch(`${config.API_BASE_URL}/api/applications`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Wallet-Address": account,
          },
          body: formData,
        });
      }
      if (!response.ok) {
        setError("Failed to submit application.");
        setLoading(false);
        return;
      }
      setSuccess(editMode ? "Application updated!" : "Application submitted!");
      setCoverLetter("");
      setProposedAmount("");
      setAttachment(null);
      if (onApplied) onApplied(await response.json());
      onClose();
    } catch (err) {
      setError("Error submitting application.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!listing) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {editMode ? "Edit Application" : `Apply for: ${listing.title}`}
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Cover Letter"
            value={coverLetter}
            onChange={e => setCoverLetter(e.target.value)}
            multiline
            minRows={3}
            fullWidth
          />
          <TextField
            label="Proposed Amount (ETH)"
            type="number"
            value={proposedAmount}
            onChange={e => setProposedAmount(e.target.value)}
            fullWidth
            required
          />
          <Button variant="outlined" component="label">
            {attachment ? attachment.name : "Upload Attachment"}
            <input
              type="file"
              hidden
              onChange={handleFileChange}
            />
          </Button>
          {error && <Alert severity="error">{error}</Alert>}
          {success && <Alert severity="success">{success}</Alert>}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : (editMode ? "Save Changes" : "Submit Application")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}