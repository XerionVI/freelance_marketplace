import React, { useState } from "react";
import { Tabs, Tab, Box } from "@mui/material";
import DisputeList from "./DisputeList";
import DisputeVoteList from "./DisputeVoteList";

function DisputeHome({ account }) {
  const [tab, setTab] = useState("all");

  return (
    <Box sx={{ mt: 2 }}>
      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        indicatorColor="primary"
        textColor="primary"
        sx={{ mb: 2 }}
      >
        <Tab label="All Disputes" value="all" />
        <Tab label="Voteable Disputes" value="voteable" />
      </Tabs>
      {tab === "all" && <DisputeList account={account} />}
      {tab === "voteable" && <DisputeVoteList account={account} />}
    </Box>
  );
}

export default DisputeHome;