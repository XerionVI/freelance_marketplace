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
import { ethers } from "ethers";
import { getFreelanceEscrowContract } from "../../utils/getContractInstance";
import config from "../../config";

export default function DisputeForm({
  open,
  onClose,
  jobDetails,
  account,
  token,
  onDisputeRaised,
}) {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRaiseDispute = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      if (!reason.trim()) {
        setError("Please provide a reason for the dispute.");
        setLoading(false);
        return;
      }
      // 1. Call the FreelanceEscrow contract to initiate the dispute
      const contract = await getFreelanceEscrowContract();
      const tx = await contract.initiateDispute(jobDetails.contractJobId);
      const receipt = await tx.wait();

      // 2. Get disputeId from DisputeInitiated event logs
      let disputeId = null;
      for (const log of receipt.logs) {
        try {
          const parsed = contract.interface.parseLog(log);
          if (parsed.name === "DisputeInitiated") {
            disputeId = parsed.args.disputeId.toString();
            break;
          }
        } catch (e) {}
      }
      if (!disputeId) {
        setError("Dispute raised on-chain, but could not get disputeId from event.");
        setLoading(false);
        return;
      }

      // 3. Save the dispute in your backend/database
      const response = await fetch(`${config.API_BASE_URL}/api/disputes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "Wallet-Address": account,
        },
        body: JSON.stringify({
          id: disputeId,
          job_id: jobDetails.job_id,
          client_address: jobDetails.client,
          freelancer_address: jobDetails.freelancer,
          amount_eth: jobDetails.amount,
          status: "Open",
          dispute_reason: reason,
        }),
      });

      await fetch(
        `${config.API_BASE_URL}/api/jobs/update-on-dispute/${jobDetails.job_id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "Wallet-Address": account,
          },
          body: JSON.stringify({ on_dispute: 1 }),
        }
      );

      if (!response.ok) {
        setError("Failed to save dispute in database.");
        setLoading(false);
        return;
      }
      setSuccess("Dispute raised successfully!");
      setReason("");
      if (onDisputeRaised) onDisputeRaised();
      onClose();
    } catch (err) {
      setError("Error raising dispute. See console for details.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Raise a Dispute</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Reason for Dispute"
            value={reason}
            onChange={e => setReason(e.target.value)}
            multiline
            minRows={3}
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
          onClick={handleRaiseDispute}
          variant="contained"
          color="error"
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Raise Dispute"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}