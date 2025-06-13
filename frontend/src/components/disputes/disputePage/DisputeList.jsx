import React, { useState, useEffect } from "react";
import {
  Stack,
  Button,
  Chip,
  LinearProgress,
  Card,
  Typography,
} from "@mui/material";
import DisputeCard from "./DisputeCard";
import config from "../../../config";
import {
  getDisputeResolutionContract,
  getFreelanceEscrowContract,
  getVotingModuleContract,
} from "../../../utils/getContractInstance";

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
        } catch (e) {}
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
  // Prompt admin for voting period in hours for easier input
  const votingPeriodHours = window.prompt(
    "Enter voting period in hours (e.g., 24 for 1 day):",
    "24"
  );
  if (
    !votingPeriodHours ||
    isNaN(Number(votingPeriodHours)) ||
    Number(votingPeriodHours) <= 0
  ) {
    alert("Invalid voting period.");
    return;
  }
  // Convert hours to seconds for the contract call
  const votingPeriodSeconds = Number(votingPeriodHours) * 3600;
  try {
    const contract = await getDisputeResolutionContract();
    const tx = await contract.startVoting(disputeId, votingPeriodSeconds);
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
            <DisputeCard
              key={dispute.id}
              dispute={dispute}
              adminAddress={adminAddress}
              currentAccount={currentAccount}
              onSelectDispute={onSelectDispute}
              userVotes={userVotes}
              votesByDispute={votesByDispute}
              clientPercent={client}
              freelancerPercent={freelancer}
              totalVotes={total}
              handleEnableVoting={handleEnableVoting}
              handleCloseDispute={handleCloseDispute}
              handleReleaseFunds={handleReleaseFunds}
              handleVote={handleVote}
            />
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
