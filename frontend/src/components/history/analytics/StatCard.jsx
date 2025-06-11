import React from "react";
import { Paper, Box, Typography } from "@mui/material";

export default function StatCard({ number, label, trend, trendType = "up" }) {
  return (
    <Paper
      elevation={3}
      sx={{
        borderRadius: 2,
        p: 3,
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
        minWidth: 0,
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: "linear-gradient(90deg, #667eea, #764ba2)",
        }}
      />
      <Typography
        sx={{
          fontSize: "2.5em",
          fontWeight: "bold",
          background: "linear-gradient(45deg, #667eea, #764ba2)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          mb: 1,
        }}
      >
        {number}
      </Typography>
      <Typography sx={{ color: "#666", fontWeight: 500 }}>{label}</Typography>
      <Box
        sx={{
          fontSize: 12,
          mt: 1,
          px: 1.5,
          py: 0.5,
          borderRadius: 2,
          display: "inline-block",
          background: trendType === "up" ? "#e8f5e8" : "#ffebee",
          color: trendType === "up" ? "#2e7d32" : "#d32f2f",
        }}
      >
        {trend}
      </Box>
    </Paper>
  );
}