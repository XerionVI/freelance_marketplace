import React from "react";
import { Box, Typography } from "@mui/material";

// Placeholder for a map or visualization of disputes
function DisputeMap({ disputes }) {
  // You can integrate a map library or chart here if needed
  return (
    <Box sx={{ p: 2, border: "1px solid #eee", borderRadius: 2, mb: 3 }}>
      <Typography variant="h6" sx={{ mb: 1 }}>
        Dispute Map (Coming Soon)
      </Typography>
      <Typography variant="body2" color="text.secondary">
        This section will visualize disputes geographically or by category.
      </Typography>
      {/* Example: Render a list for now */}
      <ul>
        {disputes.map((d) => (
          <li key={d.id}>
            {d.jobTitle || d.job_id} — Status: {d.status}
          </li>
        ))}
      </ul>
    </Box>
  );
}

export default DisputeMap;