import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Paper,
  Chip,
  Divider,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import WorkIcon from "@mui/icons-material/Work";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import DescriptionIcon from "@mui/icons-material/Description";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case "declined":
      return "error";
    case "accepted":
      return "success";
    case "pending":
      return "warning";
    case "completed":
      return "primary";
    case "disputed":
      return "secondary";
    default:
      return "default";
  }
};

const InfoPaper = ({ icon, label, value }) => (
  <Paper elevation={3} sx={{ p: 2, display: "flex", alignItems: "center", mb: 2 }}>
    {icon && <Box sx={{ mr: 2 }}>{icon}</Box>}
    <Box>
      <Typography variant="subtitle2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body1" sx={{ wordBreak: "break-all" }}>
        {value}
      </Typography>
    </Box>
  </Paper>
);

const JobDetails = ({ jobDetails }) => (
  <Card sx={{ mb: 4, p: 2, background: "#f8fafc" }}>
    <CardContent>
      <Typography variant="h4" gutterBottom>
        <WorkIcon sx={{ mr: 1, verticalAlign: "middle" }} />
        Job Details
      </Typography>
      <Divider sx={{ mb: 2 }} />

      {/* Section 1: Job IDs */}
      <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
        Job IDs
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <InfoPaper
            icon={<AssignmentIndIcon color="primary" />}
            label="Job ID"
            value={jobDetails.job_id}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <InfoPaper
            icon={<AssignmentIndIcon color="secondary" />}
            label="Contract Job ID"
            value={jobDetails.contractJobId ?? "-"}
          />
        </Grid>
      </Grid>

      {/* Section 2: Addresses */}
      <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
        Addresses
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <InfoPaper
            icon={<PersonIcon color="primary" />}
            label="Client"
            value={jobDetails.client}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <InfoPaper
            icon={<PersonIcon color="secondary" />}
            label="Freelancer"
            value={jobDetails.freelancer}
          />
        </Grid>
      </Grid>

      {/* Section 3: Other Details */}
      <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
        Other Details
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <InfoPaper
            icon={<MonetizationOnIcon color="success" />}
            label="Amount"
            value={`${jobDetails.amount} ETH`}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2, display: "flex", alignItems: "center", mb: 2 }}>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Status :
              </Typography>
            </Box>
            <Box sx={{ mr: 2 }}>
              <Chip
                label={jobDetails.status}
                color={getStatusColor(jobDetails.status)}
                sx={{ fontWeight: "bold", fontSize: 16 }}
              />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <InfoPaper
            icon={<WorkIcon color="action" />}
            label="Job Title"
            value={jobDetails.jobTitle || "N/A"}
          />
        </Grid>
        <Grid item xs={12}>
          <InfoPaper
            icon={<DescriptionIcon color="action" />}
            label="Description"
            value={jobDetails.description || "N/A"}
          />
        </Grid>
      </Grid>
    </CardContent>
  </Card>
);

export default JobDetails;