import React from "react";
import { Stack, Button, Typography } from "@mui/material";

function DisputeActions({
  dispute,
  adminAddress,
  currentAccount,
  handleEnableVoting,
  handleCloseDispute,
  handleReleaseFunds,
}) {
  return (
    <>
      {dispute.status?.toLowerCase() === "open" &&
        currentAccount !== adminAddress && (
          <Typography variant="caption" color="warning.main">
            Waiting for admin to enable voting...
          </Typography>
        )}
      <Stack
        direction="row"
        spacing={2}
        sx={{ mt: 2, mb: 1 }}
        justifyContent="flex-end"
      >
        {/* Enable Voting (admin only, open status) */}
        {dispute.status?.toLowerCase() === "open" &&
          currentAccount === adminAddress && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleEnableVoting(dispute.id)}
            >
              Enable Voting
            </Button>
          )}

        {/* Close Dispute (admin only, not resolved) */}
        {currentAccount === adminAddress &&
          dispute.status?.toLowerCase() !== "resolved" && (
            <Button
              variant="contained"
              color="error"
              onClick={() => handleCloseDispute(dispute.id)}
            >
              Close Dispute
            </Button>
          )}

        {/* Release Funds (admin or winner, resolved) */}
        {dispute.status?.toLowerCase() === "resolved" &&
          dispute.fundsReleased !== true &&
          (currentAccount === adminAddress ||
            currentAccount ===
              (dispute.winner_address || dispute.winner)?.toLowerCase()) && (
            <Button
              variant="contained"
              color="success"
              onClick={() => handleReleaseFunds(dispute.id)}
            >
              Release Funds
            </Button>
          )}
      </Stack>
    </>
  );
}

export default DisputeActions;