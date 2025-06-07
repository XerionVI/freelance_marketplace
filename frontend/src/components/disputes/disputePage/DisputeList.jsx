import React, { useState, useEffect } from "react";
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
import {
  getDisputeResolutionContract,
  getFreelanceEscrowContract,
  getVotingModuleContract,
} from "../../../utils/getContractInstance";
import config from "../../../config";

const statusMap = {
  open: {
    color: "info",
    label: "Open",
    icon: <ErrorOutline fontSize="small" />,
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

function DisputeList({
  disputes,
  selectedTab,
  setSelectedTab,
  tabCounts,
  onSelectDispute,
  loading,
}) {
  const [userVotes, setUserVotes] = useState({});
  const [votesByDispute, setVotesByDispute] = useState({});
  const adminAddress = config.ADMIN_ADDRESS?.toLowerCase();
  const currentAccount = window.ethereum?.selectedAddress?.toLowerCase();

  // Fetch user votes for all disputes (for current user)
  useEffect(() => {
    const fetchUserVotes = async () => {
      if (!currentAccount || !disputes.length) return;
      const votesByDispute = {};
      for (const dispute of disputes) {
        try {
          const res = await fetch(
            `${config.API_BASE_URL}/api/votes/dispute/${dispute.id}`
          );
          const votes = await res.json();
          const userVote = votes.find(
            (v) => v.voter_address?.toLowerCase() === currentAccount
          );
          if (userVote) {
            votesByDispute[dispute.id] = userVote.choice;
          }
        } catch (e) {
          // Optionally handle error
        }
      }
      setUserVotes(votesByDispute);
    };
    fetchUserVotes();
  }, [disputes, currentAccount]);

  // Fetch all votes for each dispute (for percentages)
  useEffect(() => {
    const fetchAllVotes = async () => {
      if (!disputes.length) return;
      const allVotes = {};
      for (const dispute of disputes) {
        try {
          const res = await fetch(
            `${config.API_BASE_URL}/api/votes/dispute/${dispute.id}`
          );
          const votes = await res.json();
          allVotes[dispute.id] = votes;
        } catch (e) {
          allVotes[dispute.id] = [];
        }
      }
      setVotesByDispute(allVotes);
    };
    fetchAllVotes();
  }, [disputes]);

  // Helper to get voting percentages
  function getVotePercentages(disputeId) {
    const votes = votesByDispute[disputeId] || [];
    const total = votes.length;
    const clientVotes = votes.filter((v) => v.choice === "client").length;
    const freelancerVotes = votes.filter(
      (v) => v.choice === "freelancer"
    ).length;
    return {
      client: total > 0 ? Math.round((clientVotes / total) * 100) : 0,
      freelancer: total > 0 ? Math.round((freelancerVotes / total) * 100) : 0,
      total,
    };
  }

  const filteredDisputes = disputes.filter((dispute) => {
    if (selectedTab === "all") return true;
    return dispute.status?.toLowerCase() === selectedTab;
  });

  // Enable voting handler (admin only)
  const handleEnableVoting = async (disputeId) => {
    try {
      const contract = await getDisputeResolutionContract();
      const tx = await contract.startVoting(disputeId);
      await tx.wait();

      await fetch(
        `${config.API_BASE_URL}/api/disputes/update-status/${disputeId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ status: "Voting" }),
        }
      );

      alert("Voting enabled for this dispute!");
    } catch (err) {
      alert("Failed to enable voting: " + (err?.reason || err?.message || err));
    }
  };

  const handleCloseDispute = async (disputeId) => {
    if (!window.confirm("Are you sure you want to close this dispute?")) return;
    try {
      // 1. Call smart contract to resolve dispute
      const contract = await getDisputeResolutionContract();
      const tx = await contract.resolveDispute(disputeId);
      await tx.wait();

      // 2. Fetch winner address from contract
      const disputeData = await contract.getDispute(disputeId);
      const winnerAddress = disputeData[7]; // winner is the 8th return value

      // 3. Update dispute status, resolved_at, and winner_address in backend
      await fetch(
        `${config.API_BASE_URL}/api/disputes/update-status/${disputeId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            status: "Resolved",
            winner_address: winnerAddress,
          }),
        }
      );

      alert("Dispute resolved successfully!");
      // Optionally: refresh disputes list here
    } catch (err) {
      alert("Failed to resolve dispute: " + (err?.message || err));
    }
  };

  const handleVote = async (disputeId, side) => {
    try {
      const contract = await getVotingModuleContract();
      const choice = side === "client" ? 1 : 2;
      const tx = await contract.castVote(disputeId, choice);
      await tx.wait();

      // Save vote to backend database
      await fetch(`${config.API_BASE_URL}/api/votes/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          dispute_id: disputeId,
          voter_address: currentAccount,
          choice: side,
        }),
      });

      setUserVotes((prev) => ({
        ...prev,
        [disputeId]: side,
      }));

      // Refresh all votes for percentages
      const res = await fetch(
        `${config.API_BASE_URL}/api/votes/dispute/${disputeId}`
      );
      const votes = await res.json();
      setVotesByDispute((prev) => ({
        ...prev,
        [disputeId]: votes,
      }));

      alert("Vote submitted successfully!");
    } catch (err) {
      alert("Failed to submit vote: " + (err?.reason || err?.message || err));
    }
  };

  const handleReleaseFunds = async (disputeId) => {
    console.log("Releasing funds for dispute:", disputeId);
    if (
      !window.confirm("Are you sure you want to release funds to the winner?")
    )
      return;
    try {
      const contract = await getFreelanceEscrowContract();
      const tx = await contract.releaseDisputedFunds(disputeId);
      await tx.wait();
      alert("Funds released successfully!");
    } catch (err) {
      alert("Failed to release funds: " + (err?.reason || err?.message || err));
    }
  };

  return (
    <>
      {/* Tabs */}
      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        {[
          { key: "all", label: "All Disputes", count: tabCounts.all },
          { key: "open", label: "Open", count: tabCounts.open },
          { key: "voting", label: "Voting", count: tabCounts.voting },
          { key: "resolved", label: "Resolved", count: tabCounts.resolved },
        ].map((tab) => (
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
        {filteredDisputes.map((dispute) => {
          const { client, freelancer, total } = getVotePercentages(dispute.id);
          return (
            <Card key={dispute.id} variant="outlined" sx={{ borderRadius: 3 }}>
              <CardContent>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="flex-start"
                  spacing={2}
                >
                  <Box>
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={1}
                      sx={{ mb: 1 }}
                    >
                      <Typography variant="h6" fontWeight="bold">
                        {dispute.jobTitle || dispute.job_id}
                      </Typography>
                      <Chip
                        icon={statusMap[dispute.status?.toLowerCase()]?.icon}
                        label={
                          statusMap[dispute.status?.toLowerCase()]?.label ||
                          dispute.status
                        }
                        color={
                          statusMap[dispute.status?.toLowerCase()]?.color ||
                          "default"
                        }
                        size="small"
                        sx={{ fontWeight: 500 }}
                      />
                    </Stack>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 1 }}
                    >
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
                          Freelancer:{" "}
                          {dispute.freelancer || dispute.freelancer_address}
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
                    <Typography
                      variant="h5"
                      fontWeight="bold"
                      color="success.main"
                    >
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
                        (
                          dispute.winner_address || dispute.winner
                        )?.toLowerCase()) && (
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
        })}
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
