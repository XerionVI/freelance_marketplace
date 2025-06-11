import React from "react";
import { Box, Typography } from "@mui/material";

export default function FlowStep({ icon, count, label, colorClass }) {
  return (
    <Box sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
      <Box
        sx={{
          width: 60,
          height: 60,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 28,
          color: "#fff",
          mb: 1,
          background: {
            created: "linear-gradient(45deg, #2196f3, #1976d2)",
            accepted: "linear-gradient(45deg, #4caf50, #388e3c)",
            completed: "linear-gradient(45deg, #ff9800, #f57c00)",
            approved: "linear-gradient(45deg, #8bc34a, #689f38)",
            disputed: "linear-gradient(45deg, #f44336, #d32f2f)",
          }[colorClass],
        }}
      >
        {icon}
      </Box>
      <Typography sx={{ fontSize: 18, fontWeight: "bold", color: "#333" }}>{count}</Typography>
      <Typography sx={{ fontSize: 12, fontWeight: 600, color: "#555" }}>{label}</Typography>
    </Box>
  );
}