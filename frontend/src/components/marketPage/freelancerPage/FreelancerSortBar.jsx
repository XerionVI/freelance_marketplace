import React from "react";
import { Box, FormControl, InputLabel, Select, MenuItem } from "@mui/material";

const FreelancerSortBar = ({ sort, setSort }) => (
  <Box sx={{ mb: 2, display: "flex", justifyContent: "flex-end" }}>
    <FormControl
      size="small"
      sx={{
        minWidth: 180,
        "& .MuiInputBase-root": { color: "#fff", borderColor: "#fff" },
        "& .MuiInputLabel-root": { color: "#fff" },
        "& .MuiSvgIcon-root": { color: "#fff" },
        "& .MuiOutlinedInput-notchedOutline": { borderColor: "#fff" }, // <-- add this line
        "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#fff" }, // <-- add this for hover
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#fff" }, // <-- add this for focus
      }}
    >
      <InputLabel>Sort By</InputLabel>
      <Select
        value={sort}
        label="Sort By"
        onChange={e => setSort(e.target.value)}
      >
        <MenuItem value="relevance">Relevance</MenuItem>
        <MenuItem value="newest">Newest</MenuItem>
        <MenuItem value="top-rated">Top Rated</MenuItem>
        <MenuItem value="lowest-rate">Lowest Rate</MenuItem>
        <MenuItem value="highest-rate">Highest Rate</MenuItem>
      </Select>
    </FormControl>
  </Box>
);

export default FreelancerSortBar;