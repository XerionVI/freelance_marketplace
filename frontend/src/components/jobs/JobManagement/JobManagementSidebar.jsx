import React from "react";
import {
  Paper,
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import ClearIcon from "@mui/icons-material/Clear";

const statusOptions = [
  "Pending",
  "Accepted",
  "Completed",
  "Disputed",
  "Declined",
];

const JobManagementSidebar = ({ filters, setFilters, jobs }) => {
  return (
    <Paper
      elevation={4}
      sx={{
        borderRadius: 3,
        p: 3,
        bgcolor: "rgba(255,255,255,0.95)",
        boxShadow: "0 8px 32px rgba(31,38,135,0.15)",
        mb: 2,
      }}
    >
      <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
        Filters
      </Typography>
      <TextField
        fullWidth
        label="Search title or description"
        variant="outlined"
        sx={{ mb: 2 }}
        value={filters.search || ""}
        onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
      />
      {/* Created Date Filter */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Created Date
        </Typography>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Created Date"
            value={filters.createdDate ? new Date(filters.createdDate) : null}
            onChange={(date) =>
              setFilters((f) => ({
                ...f,
                createdDate: date
                  ? `${date.getFullYear()}-${String(
                      date.getMonth() + 1
                    ).padStart(2, "0")}-${String(date.getDate()).padStart(
                      2,
                      "0"
                    )}`
                  : "",
              }))
            }
            slotProps={{
              textField: {
                fullWidth: true,
                InputProps: {
                  endAdornment: filters.createdDate ? (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() =>
                          setFilters((f) => ({ ...f, createdDate: "" }))
                        }
                        aria-label="Clear created date"
                      >
                        <ClearIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ) : null,
                },
              },
            }}
          />
        </LocalizationProvider>
      </Box>
      {/* Deadline Date Filter */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Deadline
        </Typography>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Deadline"
            value={filters.deadline ? new Date(filters.deadline) : null}
            onChange={(date) =>
              setFilters((f) => ({
                ...f,
                deadline: date
                  ? `${date.getFullYear()}-${String(
                      date.getMonth() + 1
                    ).padStart(2, "0")}-${String(date.getDate()).padStart(
                      2,
                      "0"
                    )}`
                  : "",
              }))
            }
            slotProps={{
              textField: {
                fullWidth: true,
                InputProps: {
                  endAdornment: filters.deadline ? (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() =>
                          setFilters((f) => ({ ...f, deadline: "" }))
                        }
                        aria-label="Clear deadline"
                      >
                        <ClearIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ) : null,
                },
              },
            }}
          />
        </LocalizationProvider>
      </Box>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Status</InputLabel>
        <Select
          value={filters.status || ""}
          label="Status"
          onChange={(e) =>
            setFilters((f) => ({ ...f, status: e.target.value }))
          }
        >
          <MenuItem value="">All</MenuItem>
          {statusOptions.map((status) => (
            <MenuItem key={status} value={status}>
              {status}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Paper>
  );
};

export default JobManagementSidebar;
