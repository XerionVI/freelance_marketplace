import React from "react";
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Divider,
  Stack,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

function DisputeDetailsModal({ dispute, onClose }) {
  if (!dispute) return null;
  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        bgcolor: "rgba(0,0,0,0.5)",
        zIndex: 1300,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Card
        sx={{
          maxWidth: 700,
          width: "100%",
          maxHeight: "90vh",
          overflowY: "auto",
          borderRadius: 3,
        }}
        variant="outlined"
      >
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="h5" fontWeight="bold">
              Dispute Details
            </Typography>
            <IconButton onClick={onClose} color="default">
              <CloseIcon sx={{ width: 28, height: 28 }} />
            </IconButton>
          </Stack>
          <Divider sx={{ mb: 2 }} />
          <Stack spacing={2}>
            <Typography variant="subtitle1" fontWeight="bold">
              Job ID: <Typography component="span" variant="body1">{dispute.job_id}</Typography>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <b>Client:</b> {dispute.client_address}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <b>Freelancer:</b> {dispute.freelancer_address}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <b>Amount:</b> {dispute.amount_eth} ETH
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <b>Status:</b> {dispute.status}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <b>Created At:</b> {dispute.created_at}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <b>Voting Ends:</b> {dispute.votingEnds}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <b>Winner:</b> {dispute.winner && dispute.winner !== "0x0000000000000000000000000000000000000000" ? dispute.winner : "Not decided"}
            </Typography>
            <Divider />
            <Typography variant="body2" color="text.secondary">
              <b>Client Evidence Submitted:</b> {dispute.clientEvidenceSubmitted ? "Yes" : "No"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <b>Freelancer Evidence Submitted:</b> {dispute.freelancerEvidenceSubmitted ? "Yes" : "No"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <b>Funds Released:</b> {dispute.fundsReleased ? "Yes" : "No"}
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}

export default DisputeDetailsModal;