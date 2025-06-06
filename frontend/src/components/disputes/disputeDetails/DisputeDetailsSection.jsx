import React from "react";
import { Stack, Typography, Paper, Chip, Avatar, Box } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

function formatDate(dateString) {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function DisputeDetailsSection({ dispute }) {
  return (
    <Stack spacing={3}>
      {/* Info Cards */}
      <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
        <Paper
          elevation={0}
          sx={{
            p: 2,
            flex: 1,
            bgcolor: "grey.50",
            border: "1px solid",
            borderColor: "grey.200",
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <MonetizationOnIcon color="primary" />
            <Typography fontWeight="bold">Dispute Amount</Typography>
          </Stack>
          <Typography variant="h6" color="primary.main">
            {dispute.amount_eth} ETH
          </Typography>
        </Paper>
        <Paper
          elevation={0}
          sx={{
            p: 2,
            flex: 1,
            bgcolor: "grey.50",
            border: "1px solid",
            borderColor: "grey.200",
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <CalendarMonthIcon color="secondary" />
            <Typography fontWeight="bold">Created</Typography>
          </Stack>
          <Typography variant="body1" color="secondary.main">
            {formatDate(dispute.created_at)}
          </Typography>
        </Paper>
        {dispute.votingEnds && (
          <Paper
            elevation={0}
            sx={{
              p: 2,
              flex: 1,
              bgcolor: "grey.50",
              border: "1px solid",
              borderColor: "grey.200",
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1}>
              <AccessTimeIcon color="warning" />
              <Typography fontWeight="bold">Voting Ends</Typography>
            </Stack>
            <Typography variant="body1" color="warning.main">
              {formatDate(dispute.votingEnds)}
            </Typography>
          </Paper>
        )}
      </Stack>
      {/* Parties */}
      <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
        <Paper
          elevation={0}
          sx={{
            flex: 1,
            p: 2,
            border: "1px solid",
            borderColor: "grey.200",
            bgcolor: "grey.50",
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <Avatar sx={{ bgcolor: "primary.light", width: 32, height: 32 }}>
              <PersonIcon color="primary" />
            </Avatar>
            <Typography fontWeight="bold">Client</Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary">
            {dispute.client_address}
          </Typography>
          <Box mt={1}>
            <Chip
              label={
                dispute.clientEvidenceSubmitted
                  ? "Evidence Submitted"
                  : "Evidence Pending"
              }
              color={dispute.clientEvidenceSubmitted ? "success" : "warning"}
              size="small"
              variant="outlined"
            />
          </Box>
        </Paper>
        <Paper
          elevation={0}
          sx={{
            flex: 1,
            p: 2,
            border: "1px solid",
            borderColor: "grey.200",
            bgcolor: "grey.50",
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <Avatar sx={{ bgcolor: "success.light", width: 32, height: 32 }}>
              <PersonIcon color="success" />
            </Avatar>
            <Typography fontWeight="bold">Freelancer</Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary">
            {dispute.freelancer_address}
          </Typography>
          <Box mt={1}>
            <Chip
              label={
                dispute.freelancerEvidenceSubmitted
                  ? "Evidence Submitted"
                  : "Evidence Pending"
              }
              color={dispute.freelancerEvidenceSubmitted ? "success" : "warning"}
              size="small"
              variant="outlined"
            />
          </Box>
        </Paper>
      </Stack>
      {/* Dispute Reason */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          bgcolor: "grey.50",
          border: "1px solid",
          borderColor: "grey.200",
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <WarningAmberIcon color="warning" />
          <Typography fontWeight="bold">Dispute Reason</Typography>
        </Stack>
        <Typography variant="body2" color="text.secondary" mt={1}>
          {dispute.dispute_reason}
        </Typography>
      </Paper>
    </Stack>
  );
}

export default DisputeDetailsSection;