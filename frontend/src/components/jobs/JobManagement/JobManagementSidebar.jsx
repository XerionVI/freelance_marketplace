import React from "react";
import { Paper, Box, Typography, TextField, FormControl, InputLabel, Select, MenuItem, Checkbox, FormControlLabel } from "@mui/material";

const JobManagementSidebar = () => (
  <Paper elevation={4} sx={{
    borderRadius: 3,
    p: 3,
    bgcolor: "rgba(255,255,255,0.95)",
    boxShadow: "0 8px 32px rgba(31,38,135,0.15)",
    mb: 2,
  }}>
    <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
      Filters
    </Typography>
    <TextField
      fullWidth
      label="Search jobs..."
      variant="outlined"
      sx={{ mb: 2 }}
    />
    <Box sx={{ mb: 2 }}>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>Date Range</Typography>
      <TextField type="date" fullWidth sx={{ mb: 1 }} />
      <TextField type="date" fullWidth />
    </Box>
    <FormControl fullWidth sx={{ mb: 2 }}>
      <InputLabel>Priority</InputLabel>
      <Select defaultValue="">
        <MenuItem value="">All Priorities</MenuItem>
        <MenuItem value="High">High</MenuItem>
        <MenuItem value="Medium">Medium</MenuItem>
        <MenuItem value="Low">Low</MenuItem>
      </Select>
    </FormControl>
    <Box sx={{ mb: 2 }}>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>Status</Typography>
      <FormControlLabel control={<Checkbox defaultChecked />} label="Pending" />
      <FormControlLabel control={<Checkbox defaultChecked />} label="In Progress" />
      <FormControlLabel control={<Checkbox defaultChecked />} label="Completed" />
      <FormControlLabel control={<Checkbox />} label="Cancelled" />
    </Box>
    <FormControl fullWidth>
      <InputLabel>Assigned To</InputLabel>
      <Select defaultValue="">
        <MenuItem value="">All Team Members</MenuItem>
        <MenuItem value="John Doe">John Doe</MenuItem>
        <MenuItem value="Jane Smith">Jane Smith</MenuItem>
        <MenuItem value="Mike Johnson">Mike Johnson</MenuItem>
      </Select>
    </FormControl>
  </Paper>
);

export default JobManagementSidebar;