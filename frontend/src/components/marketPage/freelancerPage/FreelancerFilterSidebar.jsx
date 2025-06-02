import React from "react";
import { Box, Typography, Slider, Checkbox, FormControlLabel, TextField, Chip, Stack, Divider } from "@mui/material";

const skills = ["Ethereum", "Design", "Video Editing", "Solidity", "Figma"];
const experienceLevels = ["Beginner", "Intermediate", "Expert"];
const tags = ["Web3", "NFT", "Smart Contract"];

const FreelancerFilterSidebar = ({ filters, setFilters }) => {
  // Implement handlers for each filter as needed
  return (
    <Box sx={{ bgcolor: "#f8fafc", p: 3, borderRadius: 2, boxShadow: 1 }}>
      <Typography variant="h6" fontWeight="bold" gutterBottom>Filters</Typography>
      <Divider sx={{ mb: 2 }} />
      {/* Skill Filter */}
      <Typography variant="subtitle2" gutterBottom>Skills</Typography>
      <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", mb: 2 }}>
        {skills.map(skill => (
          <Chip
            key={skill}
            label={skill}
            color={filters.skills?.includes(skill) ? "primary" : "default"}
            onClick={() => {
              const newSkills = filters.skills?.includes(skill)
                ? filters.skills.filter(s => s !== skill)
                : [...(filters.skills || []), skill];
              setFilters({ ...filters, skills: newSkills });
            }}
            sx={{ mb: 1 }}
          />
        ))}
      </Stack>
      {/* Experience Level */}
      <Typography variant="subtitle2" gutterBottom>Experience Level</Typography>
      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
        {experienceLevels.map(level => (
          <Chip
            key={level}
            label={level}
            color={filters.experience === level ? "primary" : "default"}
            onClick={() => setFilters({ ...filters, experience: level })}
          />
        ))}
      </Stack>
      {/* Hourly Rate */}
      <Typography variant="subtitle2" gutterBottom>Hourly Rate</Typography>
      <Slider
        value={filters.rate || [0, 100]}
        onChange={(_, value) => setFilters({ ...filters, rate: value })}
        valueLabelDisplay="auto"
        min={0}
        max={200}
        sx={{ mb: 2 }}
      />
      {/* Rating */}
      <Typography variant="subtitle2" gutterBottom>Rating</Typography>
      <Slider
        value={filters.rating || 0}
        onChange={(_, value) => setFilters({ ...filters, rating: value })}
        valueLabelDisplay="auto"
        min={0}
        max={5}
        step={0.5}
        sx={{ mb: 2 }}
      />
      {/* Verified */}
      <FormControlLabel
        control={
          <Checkbox
            checked={!!filters.verified}
            onChange={e => setFilters({ ...filters, verified: e.target.checked })}
          />
        }
        label="Verified Only"
        sx={{ mb: 2 }}
      />
      {/* Tags */}
      <Typography variant="subtitle2" gutterBottom>Tags</Typography>
      <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", mb: 2 }}>
        {tags.map(tag => (
          <Chip
            key={tag}
            label={tag}
            color={filters.tags?.includes(tag) ? "primary" : "default"}
            onClick={() => {
              const newTags = filters.tags?.includes(tag)
                ? filters.tags.filter(t => t !== tag)
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