import React from "react";
import { Box, Typography } from "@mui/material";

export default function ProgressRing({ value, color, label }) {
  const radius = 50;
  const stroke = 8;
  const normalizedRadius = radius - stroke / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const progress = circumference - (value / 100) * circumference;

  return (
    <Box sx={{ position: "relative", width: 120, height: 120 }}>
      <svg width={120} height={120}>
        <circle
          stroke="#e0e0e0"
          fill="none"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={60}
          cy={60}
        />
        <circle
          stroke={color}
          fill="none"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={60}
          cy={60}
          strokeDasharray={circumference}
          strokeDashoffset={progress}
          style={{ transition: "stroke-dashoffset 1s ease" }}
        />
      </svg>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
        }}
      >
        <Typography sx={{ fontSize: 24, fontWeight: "bold", color }}>{value}%</Typography>
        <Typography sx={{ fontSize: 12, color: "#666" }}>{label}</Typography>
      </Box>
    </Box>
  );
}