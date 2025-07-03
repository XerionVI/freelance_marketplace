import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Slider,
  Checkbox,
  FormControlLabel,
  Chip,
  Stack,
  Divider,
  Rating,
  IconButton,
  Autocomplete,
  TextField,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import axios from "axios";

// Remove static skills array
const experienceLevels = ["Beginner", "Intermediate", "Expert"];
const tags = ["Web3", "NFT", "Smart Contract"];

const FreelancerFilterSidebar = ({ filters, setFilters }) => {
  const [allSkills, setAllSkills] = useState([]);
  const [randomSkills, setRandomSkills] = useState([]);

  useEffect(() => {
    // Fetch all skills from backend
    axios.get(`${config.API_BASE_URL}/api/skills`).then((res) => {
      setAllSkills(res.data || []);
      // Pick 5 random skills for quick chips
      const shuffled = [...res.data].sort(() => 0.5 - Math.random());
      setRandomSkills(shuffled.slice(0, 5));
    });
  }, []);

  return (
    <Box sx={{ bgcolor: "#f8fafc", p: 3, borderRadius: 2, boxShadow: 1 }}>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Filters
      </Typography>
      <Divider sx={{ mb: 2 }} />
      {/* Skill Filter */}
      <Typography variant="subtitle2" gutterBottom>
        Skills
      </Typography>
      {/* Quick random skill chips */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 1,
          mb: 1,
          justifyContent: "space-between",
        }}
      >
        {randomSkills.map((skill) => (
          <Chip
            key={skill.id}
            label={skill.name}
            color={filters.skills?.includes(skill.name) ? "primary" : "default"}
            onClick={() => {
              const newSkills = filters.skills?.includes(skill.name)
                ? filters.skills.filter((s) => s !== skill.name)
                : [...(filters.skills || []), skill.name];
              setFilters({ ...filters, skills: newSkills });
            }}
            sx={{ flex: "1 1 40%", minWidth: 0 }}
          />
        ))}
      </Box>
      {/* Searchable skill selector */}
      <Autocomplete
        multiple
        options={allSkills.map((s) => s.name)}
        value={filters.skills || []}
        onChange={(_, value) => setFilters({ ...filters, skills: value })}
        renderInput={(params) => (
          <TextField {...params} label="Search skills" variant="outlined" />
        )}
        sx={{ mb: 2 }}
        disableCloseOnSelect
      />
      {/* Experience Level */}
      <Typography variant="subtitle2" gutterBottom>
        Experience Level
      </Typography>
      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
        {experienceLevels.map((level) => (
          <Chip
            key={level}
            label={level}
            color={filters.experience === level ? "primary" : "default"}
            onClick={() =>
              setFilters({
                ...filters,
                experience: filters.experience === level ? "" : level,
              })
            }
          />
        ))}
      </Stack>
      {/* Hourly Rate */}
      <Typography variant="subtitle2" gutterBottom>
        Hourly Rate
      </Typography>
      <Slider
        value={filters.rate || [0, 100]}
        onChange={(_, value) => setFilters({ ...filters, rate: value })}
        valueLabelDisplay="auto"
        min={0}
        max={200}
        sx={{ mb: 2 }}
      />
      {/* Rating */}
      <Typography variant="subtitle2" gutterBottom>
        Rating
      </Typography>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
        <Rating
          name="rating-filter"
          value={filters.rating || 0}
          precision={0.5}
          onChange={(_, value) => setFilters({ ...filters, rating: value })}
        />
        {filters.rating ? (
          <IconButton
            size="small"
            onClick={() => setFilters({ ...filters, rating: 0 })}
            aria-label="Clear rating"
          >
            <ClearIcon fontSize="small" />
          </IconButton>
        ) : null}
      </Stack>
      {/* Verified */}
      <FormControlLabel
        control={
          <Checkbox
            checked={!!filters.verified}
            onChange={(e) =>
              setFilters({ ...filters, verified: e.target.checked })
            }
          />
        }
        label="Verified Only"
        sx={{ mb: 2 }}
      />
      {/* Tags */}
      <Typography variant="subtitle2" gutterBottom>
        Tags
      </Typography>
      <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", mb: 2 }}>
        {tags.map((tag) => (
          <Chip
            key={tag}
            label={tag}
            color={filters.tags?.includes(tag) ? "primary" : "default"}
            onClick={() => {
              const newTags = filters.tags?.includes(tag)
                ? filters.tags.filter((t) => t !== tag)
                : [...(filters.tags || []), tag];
              setFilters({ ...filters, tags: newTags });
            }}
            sx={{ mb: 1 }}
          />
        ))}
      </Stack>
    </Box>
  );
};

export default FreelancerFilterSidebar;