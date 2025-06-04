import React from "react";
import {
  Typography,
  Box,
  Paper,
  Chip,
  Divider,
  Stack,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

const statusMap = {
  Accepted: { color: "success", icon: <CheckCircleIcon fontSize="small" /> },
  Pending: { color: "warning", icon: <ErrorOutlineIcon fontSize="small" /> },
  Declined: { color: "error", icon: <ErrorOutlineIcon fontSize="small" /> },
  Completed: { color: "primary", icon: <CheckCircleIcon fontSize="small" /> },
  Disputed: { color: "secondary", icon: <ErrorOutlineIcon fontSize="small" /> },
};

function StatusBadge({ status }) {
  const { color, icon } = statusMap[status] || statusMap["Pending"];
  return (
    <Chip
      icon={icon}
      label={status}
      color={color}
      variant="outlined"
      sx={{ fontWeight: 500, fontSize: 14, px: 1.5 }}
    />
  );
}

function AddressCard({ title, address, icon }) {
  return (
    <Paper
      elevation={2}
      sx={{
        p: 2,
        borderRadius: 2,
        display: "flex",
        alignItems: "flex-start",
        gap: 2,
        mb: 2,
        bgcolor: "rgba(248,250,252,0.85)",
        boxShadow: "0 2px 8px rgba(31,38,135,0.08)",
        width: "100%",
      }}
    >
      <Box sx={{ mt: 0.5 }}>{icon}</Box>
      <Box>
        <Typography variant="subtitle2" color="text.secondary">
          {title}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            fontFamily: "monospace",
            wordBreak: "break-all",
            bgcolor: "#fff",
            borderRadius: 1,
            px: 1,
            py: 0.5,
            border: "1px solid #e0e0e0",
            mt: 0.5,
          }}
        >
          {address}
        </Typography>
      </Box>
    </Paper>
  );
}

const JobDetails = ({ jobDetails }) => (
  <Box sx={{ width: "100%" }}>
    {/* Line 1: Contract Details Card */}
    <Paper
      elevation={2}
      sx={{
        p: 3,
        borderRadius: 3,
        mb: 2,
        bgcolor: "rgba(248,250,252,0.85)",
        boxShadow: "0 2px 8px rgba(31,38,135,0.08)",
        width: "100%",
      }}
    >
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Contract Details
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Stack spacing={2}>
        <Stack direction="row" justifyContent="space-between">
          <Typography color="text.secondary">Job ID</Typography>
          <Typography fontWeight={500}>{jobDetails.job_id}</Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between">
          <Typography color="text.secondary">Contract Job ID</Typography>
          <Typography fontWeight={500}>{jobDetails.contractJobId ?? "-"}</Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between">
          <Typography color="text.secondary">Status</Typography>
          <StatusBadge status={jobDetails.status} />
        </Stack>
        <Stack direction="row" justifyContent="space-between">
          <Typography color="text.secondary">Amount</Typography>
          <Typography fontWeight={600} color="success.main">
            {jobDetails.amount} ETH
          </Typography>
        </Stack>
      </Stack>
    </Paper>
    {/* Line 2: Client Address */}
    <AddressCard
      title="Client Address"
      address={jobDetails.client}
      icon={<PersonIcon fontSize="small" />}
    />
    {/* Line 3: Freelancer Address */}
    <AddressCard
      title="Freelancer Address"
      address={jobDetails.freelancer}
      icon={<PersonIcon fontSize="small" />}
    />

    {/* New Section: Other Details */}
    <Paper
      elevation={2}
      sx={{
        p: 3,
        borderRadius: 3,
        mt: 2,
        bgcolor: "rgba(248,250,252,0.85)",
        boxShadow: "0 2px 8px rgba(31,38,135,0.08)",
        width: "100%",
      }}
    >
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Other Details
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Stack spacing={2}>
        <Stack direction="row" justifyContent="space-between">
          <Typography color="text.secondary">Title</Typography>
          <Typography fontWeight={500}>{jobDetails.title}</Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between">
          <Typography color="text.secondary">Description</Typography>
          <Typography fontWeight={500} sx={{ maxWidth: 400, textAlign: "right" }}>
            {jobDetails.description}
          </Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between">
          <Typography color="text.secondary">Category</Typography>
          <Typography fontWeight={500}>{jobDetails.category_id}</Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between">
          <Typography color="text.secondary">Deadline</Typography>
          <Typography fontWeight={500}>{jobDetails.deadline}</Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between">
          <Typography color="text.secondary">Delivery Format</Typography>
          <Typography fontWeight={500}>{jobDetails.delivery_format}</Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between">
          <Typography color="text.secondary">Timezone</Typography>
          <Typography fontWeight={500}>{jobDetails.timezone}</Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between">
          <Typography color="text.secondary">Created At</Typography>
          <Typography fontWeight={500}>{jobDetails.created_at}</Typography>
        </Stack>
      </Stack>
    </Paper>
  </Box>
);

export default JobDetails;