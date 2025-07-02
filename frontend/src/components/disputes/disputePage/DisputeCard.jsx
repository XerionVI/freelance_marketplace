import React from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  Stack,
  Button,
  Box,
  Divider,
} from "@mui/material";
import {
  AccessTime,
  HowToVote,
  CheckCircle,
  ChevronRight,
  Person,
  Group,
} from "@mui/icons-material";

// statusMap can be imported or defined here
const statusMap = {
  open: {
    color: "info",
    label: "Open",
    icon: <HowToVote fontSize="small" />,
  },
  voting: {
    color: "warning",
    label: "Voting",
    icon: <HowToVote fontSize="small" />,
  },
  resolved: {
    color: "success",
    label: "Resolved",
    icon: <CheckCircle fontSize="small" />,
  },
};

function DisputeCard({
  dispute,
  adminAddress,
  currentAccount,
  onSelectDispute,
  userVotes = {},
  votesByDispute = {},
  handleEnableVoting,
  handleCloseDispute,
  handleReleaseFunds,
  handleVote,
}) {
  // Helper to get voting percentages
  function getVotePercentages(disputeId) {
    const votes = votesByDispute[disputeId] || [];
    const total = votes.length;
    const clientVotes = votes.filter((v) => v.choice === "client").length;
    const freelancerVotes = votes.filter((v) => v.choice === "freelancer").length;
    return {
      client: total > 0 ? Math.round((clientVotes / total) * 100) : 0,
      freelancer: total > 0 ? Math.round((freelancerVotes / total) * 100) : 0,
      total,
    };
  }

  const { client, freelancer, total } = getVotePercentages(dispute.id);

  return (
    <Card variant="outlined" sx={{ borderRadius: 3 }}>
      <CardContent>
        {/* Header and Info */}
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
          <Box>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
              <Typography variant="h6" fontWeight="bold">
                {dispute.jobTitle || dispute.job_id}
              </Typography>
              <Chip
                icon={statusMap[dispute.status?.toLowerCase()]?.icon}
                label={statusMap[dispute.status?.toLowerCase()]?.label || dispute.status}
                color={statusMap[dispute.status?.toLowerCase()]?.color || "default"}
                size="small"
                sx={{ fontWeight: 500 }}
              />
            </Stack>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {dispute.description}
            </Typography>
            <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Person fontSize="small" />
                <Typography variant="caption">
                  Client: {dispute.client || dispute.client_address}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <Group fontSize="small" />
                <Typography variant="caption">
                  Freelancer: {dispute.freelancer || dispute.freelancer_address}
                </Typography>
              </Stack>
            </Stack>
            <Stack direction="row" spacing={2}>
              <Chip
                icon={<AccessTime fontSize="small" />}
                label={`Created: ${dispute.created_at || "-"}`}
                size="small"
                variant="outlined"
              />
              <Chip
                icon={<HowToVote fontSize="small" />}
                label={`Votes: ${total}`}
                size="small"
                variant="outlined"
              />
            </Stack>
          </Box>
          <Box textAlign="right">
            <Typography variant="h5" fontWeight="bold" color="success.main">
              {dispute.amount || dispute.amount_eth} ETH
            </Typography>
            <Typography variant="caption" color="text.secondary">
              at stake
            </Typography>
          </Box>
        </Stack>
        {/* Admin Actions */}
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
        {/* Voting Section */}
        {(dispute.status?.toLowerCase() === "voting" ||
          dispute.status?.toLowerCase() === "open" ||
          dispute.status?.toLowerCase() === "resolved" ||
          dispute.status?.toLowerCase() === "pending_admin") && (
          <>
            <Divider sx={{ my: 2 }} />
            <Stack
              direction="row"
              alignItems="center"
              spacing={2}
              sx={{ mb: 1 }}
            >
              <Typography variant="body2" color="text.secondary">
                Community Votes: {total}
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
                  color={
                    dispute.winner === "client" ? "info" : "success"
                  }
                  size="small"
                  variant="outlined"
                />
              )}
            </Stack>
            {/* Vote Bar */}
            <Box sx={{ width: "100%", mb: 1 }}>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="caption">
                  Client ({client}%)
                </Typography>
                <Typography variant="caption">
                  Freelancer ({freelancer}%)
                </Typography>
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
                {/* Client portion (blue/primary) */}
                <Box
                  sx={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    height: "100%",
                    width: `${client}%`,
                    backgroundColor: "primary.main",
                    transition: "width 0.3s",
                  }}
                />
                {/* Freelancer portion (green/success) */}
                <Box
                  sx={{
                    position: "absolute",
                    left: `${client}%`,
                    top: 0,
                    height: "100%",
                    width: `${freelancer}%`,
                    backgroundColor: "success.main",
                    transition: "width 0.3s",
                  }}
                />
                {/* Middle divider */}
                <Box
                  sx={{
                    position: "absolute",
                    left: `${client}%`,
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
                Total Votes: {total}
              </Typography>
            </Box>
            {/* Voting Buttons */}
            {dispute.status?.toLowerCase() === "voting" &&
              !userVotes[dispute.id] && (
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
            {userVotes[dispute.id] && (
              <Box sx={{ mt: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  You voted for: <b>{userVotes[dispute.id]}</b>
                </Typography>
              </Box>
            )}
          </>
        )}
      </CardContent>
      <CardActions sx={{ justifyContent: "space-between" }}>
        <Typography variant="caption" color="text.secondary">
          Created: {dispute.created_at || "-"}
          {dispute.resolvedAt && ` • Resolved: ${dispute.resolvedAt}`}
        </Typography>
        <Button
          endIcon={<ChevronRight />}
          onClick={() => onSelectDispute(dispute)}
          color="primary"
          variant="outlined"
          size="small"
        >
          View Details
        </Button>
      </CardActions>
    </Card>
  );
}

export default DisputeCard;