import React, { useState, useEffect } from "react";
import {
  Paper,
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Slider,
  List,
  ListItemButton,
  ListItemText,
  InputAdornment,
  IconButton,
  OutlinedInput,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import config from "../../../config";

function ListingsSidebar({ listings, onSelect, onFilter }) {
  // Filter state
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [skill, setSkill] = useState([]);
  const [budget, setBudget] = useState([0, 100]);
  const [categories, setCategories] = useState([]);
  const [skills, setSkills] = useState([]);
  const [budgetRange, setBudgetRange] = useState([0, 100]);

  // Fetch categories and skills for filter dropdowns
  useEffect(() => {
    fetch(`${config.API_BASE_URL}/api/categories`)
      .then((res) => res.json())
      .then(setCategories)
      .catch(() => setCategories([]));
    fetch(`${config.API_BASE_URL}/api/skills`)
      .then((res) => res.json())
      .then(setSkills)
      .catch(() => setSkills([]));
  }, []);

  // Calculate min/max budget for slider
  useEffect(() => {
    if (listings.length) {
      const budgets = listings.map((l) => Number(l.budget) || 0);
      const min = Math.min(...budgets, 0);
      const max = Math.max(...budgets, 100);
      setBudgetRange([min, max]);
      setBudget([min, max]);
    }
  }, [listings]);

  // Filtering logic
  const filteredListings = listings.filter((listing) => {
    // Search (title, description, category, skills)
    const searchLower = search.toLowerCase();
    const matchesSearch =
      !search ||
      listing.title?.toLowerCase().includes(searchLower) ||
      listing.description?.toLowerCase().includes(searchLower) ||
      categories.find((c) => c.id === listing.category_id && c.name.toLowerCase().includes(searchLower)) ||
      (listing.required_skills || "")
        .split(",")
        .some((sid) => {
          const skillObj = skills.find((s) => String(s.id) === String(sid));
          return skillObj && skillObj.name.toLowerCase().includes(searchLower);
        });

    // Category
    const matchesCategory = !category || String(listing.category_id) === String(category);

    // Status
    const matchesStatus = !status || listing.status === status;

    // Skills (at least one selected skill is in required_skills)
    const requiredSkillIds = (listing.required_skills || "").split(",").map((s) => String(s));
    const matchesSkills =
      !skill.length ||
      skill.some((selectedSkillId) => requiredSkillIds.includes(String(selectedSkillId)));

    // Budget
    const budgetValue = Number(listing.budget) || 0;
    const matchesBudget = budgetValue >= budget[0] && budgetValue <= budget[1];

    return (
      matchesSearch &&
      matchesCategory &&
      matchesStatus &&
      matchesSkills &&
      matchesBudget
    );
  });

  // Notify parent of filtered listings (optional)
  useEffect(() => {
    if (onFilter) onFilter(filteredListings);
    // eslint-disable-next-line
  }, [search, category, status, skill, budget, listings]);

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
        Filter Listings
      </Typography>
      {/* Search Bar */}
      <TextField
        fullWidth
        label="Search"
        variant="outlined"
        sx={{ mb: 2 }}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        InputProps={{
          endAdornment: search ? (
            <InputAdornment position="end">
              <IconButton
                size="small"
                onClick={() => setSearch("")}
                aria-label="Clear search"
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ) : null,
        }}
      />
      {/* Category Filter */}
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Category</InputLabel>
        <Select
          value={category}
          label="Category"
          onChange={(e) => setCategory(e.target.value)}
        >
          <MenuItem value="">All</MenuItem>
          {categories.map((cat) => (
            <MenuItem key={cat.id} value={cat.id}>
              {cat.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {/* Skills Filter */}
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Skills</InputLabel>
        <Select
          multiple
          value={skill}
          onChange={(e) => setSkill(e.target.value)}
          input={<OutlinedInput label="Skills" />}
          renderValue={(selected) => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {selected.map((value) => {
                const skillObj = skills.find((s) => String(s.id) === String(value));
                return (
                  <Chip key={value} label={skillObj ? skillObj.name : value} />
                );
              })}
            </Box>
          )}
        >
          {skills.map((s) => (
            <MenuItem key={s.id} value={s.id}>
              {s.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {/* Budget Filter */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Budget (ETH)
        </Typography>
        <Slider
          value={budget}
          min={budgetRange[0]}
          max={budgetRange[1]}
          onChange={(_, newValue) => setBudget(newValue)}
          valueLabelDisplay="auto"
          step={0.01}
        />
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="caption">{budget[0]}</Typography>
          <Typography variant="caption">{budget[1]}</Typography>
        </Box>
      </Box>
      {/* Status Filter */}
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Status</InputLabel>
        <Select
          value={status}
          label="Status"
          onChange={(e) => setStatus(e.target.value)}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="Open">Open</MenuItem>
          <MenuItem value="Closed">Closed</MenuItem>
          <MenuItem value="Hired">Hired</MenuItem>
        </Select>
      </FormControl>
      {/* Filtered Listings */}
      <Typography variant="subtitle2" sx={{ mb: 1, mt: 2 }}>
        {filteredListings.length} Listings
      </Typography>
      <List>
        {filteredListings.map((listing) => (
          <ListItemButton
            key={listing.listing_id}
            onClick={() => onSelect(listing)}
          >
            <ListItemText
              primary={listing.title}
              secondary={`Budget: ${listing.budget} ETH`}
            />
          </ListItemButton>
        ))}
      </List>
    </Paper>
  );
}

export default ListingsSidebar;