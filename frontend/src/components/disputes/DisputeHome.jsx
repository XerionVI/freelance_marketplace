import React, { useState, useEffect } from "react";
import DisputeList from "./DisputeList";
import DisputeSidebar from "./DisputeSidebar";
import DisputeDetailsModal from "./DisputeDetailsModal";
import { ethers } from "ethers";
import { getDisputeResolutionContract } from "../../utils/getContractInstance";
import { Box, Grid, Paper } from "@mui/material";

function DisputeHome({ account }) {
  const [disputes, setDisputes] = useState([]);
  const [selectedTab, setSelectedTab] = useState("all");
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchDisputes = async () => {
    setLoading(true);
    try {
      if (!account) {
        setDisputes([]);
        setLoading(false);
        return;
      }
      const contract = await getDisputeResolutionContract();
      if (!contract) {
        setDisputes([]);
        setLoading(false);
        return;
      }
      const disputeCount = await contract.getDisputeCount();
      if (!disputeCount || disputeCount === 0) {
        setDisputes([]);
        setLoading(false);
        return;
      }
      const disputesArr = [];
      for (let i = 0; i < disputeCount; i++) {
        const d = await contract.getDispute(i);
        const statusEnum = ["open", "voting", "resolved", "cancelled"];
        let statusValue = d[6];
        let statusIndex = typeof statusValue === "bigint" ? Number(statusValue) : statusValue;
        let statusString = statusEnum[statusIndex] || "unknown";

        disputesArr.push({
          id: i.toString(),
          job_id: d[11]?.toString?.() ?? "",
          client_address: d[1],
          freelancer_address: d[2],
          amount_eth: ethers.formatEther(d[3]),
          status: statusString,
          created_at: d[4]
            ? new Date(Number(d[4]) * 1000).toISOString().slice(0, 10)
            : "",
          votingEnds: d[5]
            ? new Date(Number(d[5]) * 1000).toISOString().slice(0, 10)
            : "",
          winner: d[7],
          fundsReleased: d[8],
          clientEvidenceSubmitted: d[9],
          freelancerEvidenceSubmitted: d[10],
        });
      }
      setDisputes(disputesArr);
    } catch (error) {
      console.error("Error fetching disputes from smart contract:", error);
      setDisputes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDisputes();
    // eslint-disable-next-line
  }, [account]);

  const tabCounts = {
    all: disputes.length,
    open: disputes.filter((d) => d.status === "open").length,
    voting: disputes.filter((d) => d.status === "voting").length,
    pending_admin: disputes.filter((d) => d.status === "pending_admin").length,
    resolved: disputes.filter((d) => d.status === "resolved").length,
  };

  return (
    <Box sx={{ maxWidth: "1400px", mx: "auto", px: { xs: 1, sm: 3 }, py: 4 }}>
      <Grid container spacing={4} sx={{ minHeight: "70vh" }}>
        <Grid item xs={12} md={8} sx={{ display: "flex", flexDirection: "column" }}>
          <Paper elevation={2} sx={{ p: { xs: 1, sm: 3 }, borderRadius: 3, flex: 1, display: "flex", flexDirection: "column" }}>
            <DisputeList
              disputes={disputes}
              selectedTab={selectedTab}
              setSelectedTab={setSelectedTab}
              tabCounts={tabCounts}
              onSelectDispute={setSelectedDispute}
              loading={loading}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={4} sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
          <DisputeSidebar tabCounts={tabCounts} />
        </Grid>
      </Grid>
      <DisputeDetailsModal
        dispute={selectedDispute}
        onClose={() => setSelectedDispute(null)}
      />
    </Box>
  );
}

export default DisputeHome;