import React from "react";
import { Paper, Typography, Box } from "@mui/material";

export default function HistoryDetails({ event }) {
  if (!event) {
    return (
      <Paper
        elevation={2}
        sx={{
          p: 3,
          borderRadius: 3,
          background: "rgba(255,255,255,0.95)",
          textAlign: "center",
        }}
      >
        <Typography variant="h6" color="text.secondary">
          Select an event to view details
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper
      elevation={4}
      sx={{
        p: 3,
        borderRadius: 3,
        background: "rgba(255,255,255,0.98)",
      }}
    >
      <Typography variant="h5" color="primary" gutterBottom>
        {event.title}
      </Typography>
      <Typography color="text.secondary" mb={2}>
        {event.time}
      </Typography>
      <Box>
        {Object.entries(event.details).map(([key, value]) => (
          <Box key={key} mb={1}>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ textTransform: "uppercase", fontWeight: 600 }}
            >
              {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
            </Typography>
            <Typography fontSize={14} color="text.primary">
              {value}
            </Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  );
}