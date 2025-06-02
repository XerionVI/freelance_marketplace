import React from "react";
import { Box, Typography, TextField, MenuItem, Stack, Button } from "@mui/material";

const UserModal = ({
  open,
  onClose,
  form,
  onChange,
  onSkillChange,
  onSave,
  experienceLevels,
  allSkills,
  loadingSkills,
}) => (
  <Box
    sx={{
      display: open ? "block" : "none",
      position: "fixed",
      zIndex: 1300,
      left: 0,
      top: 0,
      width: "100vw",
      height: "100vh",
      bgcolor: "rgba(0,0,0,0.3)",
    }}
  >
    <Box
      sx={{
        p: 4,
        bgcolor: "#fff",
        maxWidth: 500,
        mx: "auto",
        mt: 8,
        borderRadius: 2,
        boxShadow: 24,
        position: "relative",
        top: "10vh",
      }}
    >
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Edit Profile
      </Typography>
      <TextField
        label="Display Name"
        name="display_name"
        value={form.display_name}
        onChange={onChange}
        fullWidth
        sx={{ mb: 2 }}
      />
      <TextField
        label="Bio"
        name="bio"
        value={form.bio}
        onChange={onChange}
        fullWidth
        multiline
        sx={{ mb: 2 }}
      />
      {/* Avatar URL field removed */}
      <TextField
        label="Portfolio URL"
        name="portfolio_url"
        value={form.portfolio_url}
        onChange={onChange}
        fullWidth
        sx={{ mb: 2 }}
      />
      <TextField
        select
        label="Experience Level"
        name="experience_level"
        value={form.experience_level}
        onChange={onChange}
        fullWidth
        sx={{ mb: 2 }}
      >
        {experienceLevels.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        select
        label="Skills"
        name="skills"
        value={form.skills}
        onChange={onSkillChange}
        fullWidth
        SelectProps={{ multiple: true }}
        sx={{ mb: 2 }}
        disabled={loadingSkills}
        helperText="Hold Ctrl/Cmd to select multiple"
      >
        {allSkills.map((skill) => (
          <MenuItem key={skill.id} value={skill.id}>
            {skill.name}
          </MenuItem>
        ))}
      </TextField>
      <Stack direction="row" spacing={2} justifyContent="flex-end">
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={onSave}>
          Save
        </Button>
      </Stack>
    </Box>
  </Box>
);

export default UserModal;