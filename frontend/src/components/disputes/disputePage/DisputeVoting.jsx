import React from "react";
import { Stack, Button, Box, Divider, Typography, Chip } from "@mui/material";
import { AccessTime, CheckCircle } from "@mui/icons-material";

function DisputeVoting({
  dispute,
  clientPercent = 0,
  freelancerPercent = 0,
  totalVotes = 0,
  userVote,
  handleVote,
}) {
  return (
    <>
      <Divider sx={{ my: 2 }} />
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Community Votes: {totalVotes}
        </Typography>
        {dispute.votingEnds &&
          dispute.status?.toLowerCase() !== "resolved" && (
            <Chip
              icon={<AccessTime fontSize="small" />}
              label={`Ends: ${dispute.votingEnds}`}
              size="small"
              variant="outlined"
            />
          )}
        {dispute.status?.toLowerCase() === "resolved" && (
          <Chip
            icon={<CheckCircle fontSize="small" />}
            label={`Winner: ${dispute.winner || "-"}`}
            color={dispute.winner === "client" ? "info" : "success"}
            size="small"
            variant="outlined"
          />
        )}
      </Stack>
      {/* Vote Bar */}
      <Box sx={{ width: "100%", mb: 1 }}>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="caption">Client ({clientPercent}%)</Typography>
          <Typography variant="caption">Freelancer ({freelancerPercent}%)</Typography>
        </Stack>
        <Box
          sx={{
            position: "relative",
            height: 10,
            borderRadius: 4,
            backgroundColor: "grey.200",
            overflow: "hidden",
            mt: 0.5,
            mb: 0.5,
          }}
        >
          {/* Client portion */}
          <Box
            sx={{
              position: "absolute",
              left: 0,
              top: 0,
              height: "100%",
              width: `${clientPercent}%`,
              backgroundColor: "primary.main",
              transition: "width 0.3s",
            }}
          />
          {/* Freelancer portion */}
          <Box
            sx={{
              position: "absolute",
              left: `${clientPercent}%`,
              top: 0,
              height: "100%",
              width: `${freelancerPercent}%`,
              backgroundColor: "success.main",
              transition: "width 0.3s",
            }}
          />
          {/* Divider */}
          <Box
            sx={{
              position: "absolute",
              left: `${clientPercent}%`,
              top: 0,
              height: "100%",
              width: "2px",
              backgroundColor: "grey.800",
              opacity: 0.7,
              zIndex: 2,
              transform: "translateX(-1px)",
            }}
          />
        </Box>
        <Typography variant="caption" color="text.secondary">
          Total Votes: {totalVotes}
        </Typography>
      </Box>
      {/* Voting Buttons */}
      {dispute.status?.toLowerCase() === "voting" && !userVote && (
        <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
          <Button
            variant="contained"
            color="info"
            onClick={() => handleVote(dispute.id, "client")}
            fullWidth
          >
            Vote for Client
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={() => handleVote(dispute.id, "freelancer")}
            fullWidth
          >
            Vote for Freelancer
          </Button>
        </Stack>
      )}
      {userVote && (
        <Box sx={{ mt: 1 }}>
          <Typography variant="body2" color="text.secondary">
            You voted for: <b>{userVote}</b>
          </Typography>
        </Box>
      )}
    </>
  );
}

export default DisputeVoting;