import React, { useState } from "react";
import { Stack, Typography, TextField, Button, Paper, Chip } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import config from "../../../config";

function DisputeArgumentsSection({ disputeId, argumentsList, onSubmitted, token, account, dispute }) {
  const [argumentText, setArgumentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Determine party type and permission
  let partyType = null;
  let canSubmit = false;
  if (dispute) {
    if (
      account &&
      dispute.client_address &&
      account.toLowerCase() === dispute.client_address.toLowerCase()
    ) {
      partyType = "client";
      canSubmit = true;
    } else if (
      account &&
      dispute.freelancer_address &&
      account.toLowerCase() === dispute.freelancer_address.toLowerCase()
    ) {
      partyType = "freelancer";
      canSubmit = true;
    }
  }

  const handleAddArgument = async () => {
    if (!argumentText.trim() || !canSubmit || !partyType) return;
    setIsSubmitting(true);
    await fetch(`${config.API_BASE_URL}/api/arguments/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "Wallet-Address": account,
      },
      body: JSON.stringify({
        dispute_id: disputeId,
        party_type: partyType,
        party_address: account,
        argument_text: argumentText,
      }),
    });
    setArgumentText("");
    setIsSubmitting(false);
    onSubmitted();
  };

  return (
    <Stack spacing={3}>
      <Typography variant="h6" fontWeight="bold">
        Arguments
      </Typography>
      <Stack spacing={2}>
        {(!argumentsList || argumentsList.length === 0) && (
          <Typography variant="body2" color="text.secondary">
            No arguments submitted yet.
          </Typography>
        )}
        {argumentsList &&
          argumentsList.map((arg) => (
            <Paper
              key={arg.id}
              elevation={0}
              sx={{
                p: 2,
                bgcolor: arg.party_type === "client" ? "primary.lighter" : "success.lighter",
                border: "1px solid",
                borderColor: arg.party_type === "client" ? "primary.light" : "success.light",
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                <Chip
                  label={arg.party_type === "client" ? "Client" : "Freelancer"}
                  color={arg.party_type === "client" ? "primary" : "success"}
                  size="small"
                />
                <Typography variant="caption" color="text.disabled">
                  {new Date(arg.submitted_at).toLocaleString()}
                </Typography>
              </Stack>
              <Typography variant="body2">{arg.argument_text}</Typography>
            </Paper>
          ))}
      </Stack>
      <Paper
        elevation={0}
        sx={{
          p: 2,
          border: "1px solid",
          borderColor: "grey.300",
        }}
      >
        <Typography fontWeight="bold" mb={1}>
          Submit New Argument
        </Typography>
        <TextField
          multiline
          minRows={3}
          fullWidth
          value={argumentText}
          onChange={(e) => setArgumentText(e.target.value)}
          placeholder={
            canSubmit
              ? "Present your argument..."
              : "You are not allowed to submit arguments for this dispute."
          }
          sx={{ mb: 2 }}
          disabled={!canSubmit}
        />
        <Stack direction="row" justifyContent="flex-end">
          <Button
            variant="contained"
            startIcon={<SendIcon />}
            onClick={handleAddArgument}
            disabled={!argumentText.trim() || isSubmitting || !canSubmit}
          >
            {isSubmitting ? "Submitting..." : "Submit Argument"}
          </Button>
        </Stack>
        {!canSubmit && (
          <Typography variant="caption" color="error" mt={1}>
            Only the client or freelancer involved in this dispute can submit arguments.
          </Typography>
        )}
      </Paper>
    </Stack>
  );
}

export default DisputeArgumentsSection;