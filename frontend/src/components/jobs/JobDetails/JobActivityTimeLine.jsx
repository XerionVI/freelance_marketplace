import React, { useEffect, useState } from "react";
import { Stack, Typography, Box, CircularProgress } from "@mui/material";
import {
  Description,
  CheckCircle,
  ErrorOutline,
  MonetizationOn,
} from "@mui/icons-material";
import { fetchJobActivityEvents } from "../../../utils/fetchJobActivityEvents";

const iconMap = {
  Description: <Description color="primary" />,
  CheckCircle: <CheckCircle color="success" />,
  ErrorOutline: <ErrorOutline color="error" />,
  MonetizationOn: <MonetizationOn color="success" />,
};

function formatTime(ts) {
  if (!ts) return "-";
  const date = new Date(ts * 1000);
  return date.toLocaleString();
}

export default function JobActivityTimeLine({ contractJobId }) {
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  if (contractJobId === null || contractJobId === undefined) {
    setLoading(false);
    setActivity([]);
    return;
  }
  setLoading(true);
  fetchJobActivityEvents(contractJobId)
    .then(setActivity)
    .finally(() => setLoading(false));
}, [contractJobId]);

  if (loading) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <CircularProgress />
        <Typography variant="body2" sx={{ mt: 2 }}>
          Loading activity...
        </Typography>
      </Box>
    );
  }

  if (!activity.length) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
        No activity found for this job.
      </Typography>
    );
  }

  return (
    <Stack spacing={3}>
      {activity.map((event, idx) => (
        <Stack direction="row" spacing={2} alignItems="center" key={idx}>
          {iconMap[event.icon] || <Description color="primary" />}
          <Box>
            <Typography fontWeight="bold">{event.label}</Typography>
            <Typography variant="body2" color="text.secondary">
              {event.name} event
              {event.name === "DisputeFundsReleased" && event.amount
                ? ` — ${event.amount} to ${event.recipient}`
                : ""}
              {event.name === "DisputeInitiated" && event.args?.disputeId
                ? ` — Dispute #${event.args.disputeId.toString()}`
                : ""}
              {event.name === "JobApproved" && event.args?.freelancer
                ? ` — Released to ${event.args.freelancer}`
                : ""}
            </Typography>
            <Typography variant="caption" color="text.disabled">
              {formatTime(event.blockTimestamp || event.timestamp)}
            </Typography>
          </Box>
        </Stack>
      ))}
    </Stack>
  );
}
