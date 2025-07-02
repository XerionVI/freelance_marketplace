import React from "react";
import { Box, Grid, Paper, Typography, TextField, MenuItem } from "@mui/material";

export default function HistorySidebar({ filters, setFilters, events }) {
  // Calculate stats from events
  const totalJobs = events.filter(e => e.type === "job").length;
  const activeDisputes = events.filter(e => e.type === "dispute" && e.details.status === "disputed").length;
  const totalVolume = events
    .filter(e => e.details.amount)
    .reduce((sum, e) => sum + parseFloat(e.details.amount.split(" ")[0]), 0)
    .toFixed(2);
  const transactions = events.length;

  const stats = [
    { label: "Total Jobs", value: totalJobs },
    { label: "Active Disputes", value: activeDisputes },
    { label: "Total Volume", value: `${totalVolume} ETH` },
    { label: "Transactions", value: transactions },
  ];

  return (
    <Box>
      <Grid container spacing={2} mb={3}>
        {stats.map((stat) => (
          <Grid key={stat.label}>
            <Paper
              elevation={2}
              sx={{
                p: 2,
                borderRadius: 2,
                textAlign: "center",
                background: "rgba(255,255,255,0.9)",
              }}
            >
              <Typography variant="h4" color="primary.main" fontWeight="bold">
                {stat.value}
              </Typography>
              <Typography color="text.secondary">{stat.label}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search by Job ID, Transaction Hash, or Wallet Address..."
        sx={{ mb: 2, borderRadius: 5, background: "white" }}
        size="small"
        value={filters.search}
        onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
      />
      <Paper sx={{ p: 2, borderRadius: 2, background: "rgba(255,255,255,0.9)" }}>
        <Grid container spacing={2}>
          <Grid >
            <TextField
              select
              label="Event Type"
              fullWidth
              value={filters.type}
              onChange={e => setFilters(f => ({ ...f, type: e.target.value }))}
              size="small"
            >
              <MenuItem value="">All Events</MenuItem>
              <MenuItem value="job">Job Events</MenuItem>
              <MenuItem value="dispute">Disputes</MenuItem>
              <MenuItem value="payment">Payments</MenuItem>
              <MenuItem value="vote">Votes</MenuItem>
            </TextField>
          </Grid>
          <Grid>
            <TextField
              select
              label="Status"
              fullWidth
              value={filters.status}
              onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}
              size="small"
            >
              <MenuItem value="">All Status</MenuItem>
              <MenuItem value="created">Created</MenuItem>
              <MenuItem value="accepted">Accepted</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="approved">Approved</MenuItem>
              <MenuItem value="disputed">Disputed</MenuItem>
            </TextField>
          </Grid>
          <Grid >
            <Typography variant="subtitle2" color="text.secondary" mb={1}>
              Date Range
            </Typography>
            <Box display="flex" gap={1}>
              <TextField
                type="date"
                size="small"
                fullWidth
                value={filters.dateFrom}
                onChange={e => setFilters(f => ({ ...f, dateFrom: e.target.value }))}
              />
              <TextField
                type="date"
                size="small"
                fullWidth
                value={filters.dateTo}
                onChange={e => setFilters(f => ({ ...f, dateTo: e.target.value }))}
              />
            </Box>
          </Grid>
          <Grid>
            <Typography variant="subtitle2" color="text.secondary" mb={1}>
              Amount Range
            </Typography>
            <Box display="flex" gap={1}>
              <TextField
                type="number"
                placeholder="Min ETH"
                size="small"
                fullWidth
                value={filters.amountMin}
                onChange={e => setFilters(f => ({ ...f, amountMin: e.target.value }))}
              />
              <TextField
                type="number"
                placeholder="Max ETH"
                size="small"
                fullWidth
                value={filters.amountMax}
                onChange={e => setFilters(f => ({ ...f, amountMax: e.target.value }))}
              />
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}