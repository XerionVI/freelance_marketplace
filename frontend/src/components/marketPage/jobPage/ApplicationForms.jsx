import React, { useState } from "react";
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

export default function ApplicationForms({ open, onClose, listing, account, token, onApplied }) {
  const [coverLetter, setCoverLetter] = useState("");
  const [proposedAmount, setProposedAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
      const response = await fetch(`${config.API_BASE_URL}/api/applications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "Wallet-Address": account,
        },
        body: JSON.stringify({
          listing_id: listing.listing_id,
          freelancer_address: account,
          cover_letter: coverLetter,
          proposed_amount: proposedAmount,
        }),
      });
      if (!response.ok) {
        setError("Failed to submit application.");
        setLoading(false);
        return;
      }
      setSuccess("Application submitted!");
      setCoverLetter("");
      setProposedAmount("");
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
      <DialogTitle>Apply for: {listing.title}</DialogTitle>
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
          {loading ? <CircularProgress size={24} /> : "Submit Application"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}