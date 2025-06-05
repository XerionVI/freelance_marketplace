import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  Stack,
  Button,
  LinearProgress,
  Box,
  Divider,
} from "@mui/material";
import {
  ErrorOutline,
  HowToVote,
  Gavel,
  CheckCircle,
  AccessTime,
  ChevronRight,
  Person,
  Group,
} from "@mui/icons-material";

const statusMap = {
  open: { color: "info", label: "Open", icon: <ErrorOutline fontSize="small" /> },
  voting: { color: "warning", label: "Voting", icon: <HowToVote fontSize="small" /> },
  resolved: { color: "success", label: "Resolved", icon: <CheckCircle fontSize="small" /> },
  pending_admin: { color: "secondary", label: "Pending Admin", icon: <Gavel fontSize="small" /> },
};

const getVotingPercentage = (votes, total) => (total > 0 ? Math.round((votes / total) * 100) : 0);

function DisputeList({ disputes, selectedTab, setSelectedTab, tabCounts, onSelectDispute, loading }) {
  const [userVotes, setUserVotes] = useState({});

  const filteredDisputes = disputes.filter(dispute => {
    if (selectedTab === "all") return true;
    return dispute.status?.toLowerCase() === selectedTab;
  });

  const handleVote = (disputeId, side) => {
    setUserVotes(prev => ({
      ...prev,
      [disputeId]: side,
    }));
    // Optionally: call backend to record vote
  };

  return (
    <>
      {/* Tabs */}
      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        {[
          { key: "all", label: "All Disputes", count: tabCounts.all },
          { key: "open", label: "Open", count: tabCounts.open },
          { key: "voting", label: "Voting", count: tabCounts.voting },
          { key: "pending_admin", label: "Pending Admin", count: tabCounts.pending_admin },
          { key: "resolved", label: "Resolved", count: tabCounts.resolved },
        ].map(tab => (
          <Button
            key={tab.key}
            variant={selectedTab === tab.key ? "contained" : "outlined"}
            color={selectedTab === tab.key ? "primary" : "inherit"}
            onClick={() => setSelectedTab(tab.key)}
            sx={{ borderRadius: 3 }}
          >
            {tab.label}
            <Chip
              label={tab.count}
              size="small"
              sx={{
                ml: 1,
                bgcolor: selectedTab === tab.key ? "primary.light" : "grey.100",
                color: selectedTab === tab.key ? "primary.main" : "grey.800",
              }}
            />
          </Button>
        ))}
      </Stack>

      {loading && <LinearProgress sx={{ mb: 2 }} />}

      <Stack spacing={3}>
        {filteredDisputes.map(dispute => (
          <Card key={dispute.id} variant="outlined" sx={{ borderRadius: 3 }}>
            <CardContent>
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
                      <Typography variant="caption">Client: {dispute.client || dispute.client_address}</Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Group fontSize="small" />
                      <Typography variant="caption">Freelancer: {dispute.freelancer || dispute.freelancer_address}</Typography>
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
                      label={`Votes: ${dispute.totalVotes || 0}`}
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
              {/* Voting Section */}
              {(dispute.status?.toLowerCase() === "voting" ||
                dispute.status?.toLowerCase() === "open" ||
                dispute.status?.toLowerCase() === "resolved" ||
                dispute.status?.toLowerCase() === "pending_admin") && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Community Votes: {dispute.totalVotes || 0}
                    </Typography>
                    {dispute.votingEnds && dispute.status?.toLowerCase() !== "resolved" && (
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
                      <Typography variant="caption">
                        Client ({getVotingPercentage(dispute.clientVotes, dispute.totalVotes)}%)
                      </Typography>
                      <Typography variant="caption">
                        Freelancer ({getVotingPercentage(dispute.freelancerVotes, dispute.totalVotes)}%)
                      </Typography>
                    </Stack>
                    <LinearProgress
                      variant="determinate"
                      value={getVotingPercentage(dispute.clientVotes, dispute.totalVotes)}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        mt: 0.5,
                        backgroundColor: "grey.200",
                        "& .MuiLinearProgress-bar": { backgroundColor: "primary.main" },
                      }}
                    />
                  </Box>
                  {/* Voting Buttons */}
                  {dispute.status?.toLowerCase() === "voting" && !userVotes[dispute.id] && (
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
        ))}
        {!loading && filteredDisputes.length === 0 && (
          <Card variant="outlined" sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="body1" color="text.secondary">
              No disputes found for this filter.
            </Typography>
          </Card>
        )}
      </Stack>
    </>
  );
}

export default DisputeList;