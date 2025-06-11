import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Chip,
  Grid,
  Button,
  Collapse,
  Tooltip,
  Stack,
} from "@mui/material";

const typeColors = {
  job: "success",
  dispute: "error",
  payment: "warning",
  vote: "secondary",
};

const statusColors = {
  created: "info",
  accepted: "success",
  completed: "warning",
  approved: "success",
  disputed: "error",
};

export default function HistoryCard({ event, selected, onClick }) {
  const [expanded, setExpanded] = useState(false);

  const handleExpand = (e) => {
    e.stopPropagation();
    setExpanded((prev) => !prev);
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Paper
      elevation={expanded || selected ? 6 : 2}
      sx={{
        borderRadius: 3,
        p: 3,
        mb: 2,
        background: "rgba(255,255,255,0.95)",
        boxShadow: expanded || selected ? 6 : 2,
        border: selected ? "2px solid #667eea" : "none",
        cursor: "pointer",
        transition: "all 0.3s",
      }}
      onClick={onClick}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Chip
          label={event.title}
          color={typeColors[event.type] || "primary"}
          sx={{ fontWeight: "bold", textTransform: "uppercase" }}
        />
        <Typography color="text.secondary" fontSize={14}>
          {event.time}
        </Typography>
      </Box>
      <Grid container spacing={2} mb={2}>
        {Object.entries(event.details)
          .filter(([k]) =>
            [
              "jobId",
              "amount",
              "status",
              "block",
              "disputeId",
              "initiatedBy",
              "recipient",
              "freelancer",
              "client",
            ].includes(k)
          )
          .map(([key, value]) => (
            <Grid key={key}>
              <Box
                sx={{
                  background: "#f8f9fa",
                  p: 2,
                  borderRadius: 2,
                  borderLeft: "4px solid #667eea",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  minHeight: 70,
                  justifyContent: "center",
                  gap: 1,
                }}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ textTransform: "uppercase", fontWeight: 600, mb: 0.5 }}
                >
                  {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                </Typography>
                {key === "status" ? (
                  <Chip
                    label={value.charAt(0).toUpperCase() + value.slice(1)}
                    size="small"
                    color={statusColors[value] || "default"}
                    sx={{
                      fontWeight: "bold",
                      textTransform: "uppercase",
                      mt: 0.5,
                    }}
                  />
                ) : (
                  <Typography fontSize={14} color="text.primary" sx={{ mt: 0.5 }}>
                    {value}
                  </Typography>
                )}
              </Box>
            </Grid>
          ))}
      </Grid>
      {(event.details.client || event.details.freelancer) && (
        <Stack direction="row" spacing={2} mt={2} mb={1}>
          {event.details.client && (
            <Box
              sx={{
                background: "#f8f9fa",
                p: 1.5,
                borderRadius: 1,
                borderLeft: "4px solid #2196f3",
                fontSize: 13,
                minWidth: 0,
              }}
            >
              <strong>Client:</strong> {event.details.client}
            </Box>
          )}
          {event.details.freelancer && (
            <Box
              sx={{
                background: "#f8f9fa",
                p: 1.5,
                borderRadius: 1,
                borderLeft: "4px solid #4caf50",
                fontSize: 13,
                minWidth: 0,
              }}
            >
              <strong>Freelancer:</strong> {event.details.freelancer}
            </Box>
          )}
        </Stack>
      )}
      <Collapse in={expanded}>
        <Box mt={2}>
          <Tooltip title="Copy transaction hash" placement="top">
            <Box
              sx={{
                fontFamily: "monospace",
                background: "#e9ecef",
                p: 1,
                borderRadius: 1,
                fontSize: 12,
                cursor: "pointer",
                mb: 1,
                wordBreak: "break-all",
              }}
              onClick={() => handleCopy(event.details.tx)}
            >
              <strong>Transaction Hash:</strong> {event.details.tx}
            </Box>
          </Tooltip>
          <Box
            sx={{
              background: "#f1f3f4",
              p: 1,
              borderRadius: 1,
              fontSize: 12,
              color: "#666",
              mb: 1,
            }}
          >
            <strong>Gas Info:</strong> {event.details.gas}
          </Box>
          {event.type === "dispute" && (
            <Box
              sx={{
                mt: 1,
                p: 1,
                background: "#fff3cd",
                borderRadius: 1,
                borderLeft: "4px solid #ffc107",
                fontSize: 13,
              }}
            >
              <strong>Voting Period:</strong> {event.details.voting} | <strong>Evidence Submitted:</strong> {event.details.evidence}
            </Box>
          )}
        </Box>
      </Collapse>
      <Button
        variant="text"
        size="small"
        sx={{ color: "#667eea", fontWeight: 600, mt: 1 }}
        onClick={handleExpand}
      >
        {expanded ? "Hide Details" : "View Details"}
      </Button>
    </Paper>
  );
}