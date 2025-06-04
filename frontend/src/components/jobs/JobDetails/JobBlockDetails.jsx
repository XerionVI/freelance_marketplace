import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Stack,
  Chip,
  Divider,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import GroupIcon from "@mui/icons-material/Group";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import StarIcon from "@mui/icons-material/Star";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import BlockIcon from "@mui/icons-material/Block";

const statusMapping = {
  0: { label: "Created", color: "info", icon: <HourglassEmptyIcon /> },
  1: { label: "Accepted", color: "success", icon: <CheckCircleIcon /> },
  2: { label: "Declined", color: "error", icon: <BlockIcon /> },
  3: { label: "Completed", color: "primary", icon: <DoneAllIcon /> },
  4: { label: "Approved", color: "success", icon: <StarIcon /> },
};

function truncateAddress(address) {
  if (!address) return "-";
  return `${address.slice(0, 8)}...${address.slice(-6)}`;
}

const JobBlockDetails = ({ open, onClose, jobBlockData }) => {
  if (!jobBlockData) return null;
  const status = statusMapping[jobBlockData.status] || statusMapping[0];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Blockchain Job Info
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Stack spacing={3}>
          <Box textAlign="center">
            <Chip
              icon={status.icon}
              label={status.label}
              color={status.color}
              sx={{ fontSize: 18, px: 2, py: 1, mb: 2 }}
            />
            <Typography variant="h6" fontWeight="bold">
              {jobBlockData.title}
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 2 }}>
              {jobBlockData.description}
            </Typography>
          </Box>
          <Divider />
          <Stack direction="row" spacing={2} justifyContent="center">
            <Chip
              icon={<PersonIcon />}
              label={`Client: ${truncateAddress(jobBlockData.client)}`}
              color="info"
              variant="outlined"
            />
            <Chip
              icon={<GroupIcon />}
              label={`Freelancer: ${truncateAddress(jobBlockData.freelancer)}`}
              color="secondary"
              variant="outlined"
            />
          </Stack>
          <Stack direction="row" spacing={2} justifyContent="center">
            <Chip
              icon={<MonetizationOnIcon />}
              label={`${jobBlockData.amount} ETH`}
              color="success"
              variant="outlined"
            />
            <Chip
              icon={<CalendarTodayIcon />}
              label={`Deadline: ${jobBlockData.deadline}`}
              color="default"
              variant="outlined"
            />
          </Stack>
          <Divider />
          <Typography variant="body2" color="text.secondary" align="center">
            Contract Job ID: {jobBlockData.jobId || jobBlockData.job_id}
          </Typography>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default JobBlockDetails;