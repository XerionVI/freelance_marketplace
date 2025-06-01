import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  Avatar,
  Typography,
  Chip,
  Button,
  Link,
  Divider,
  Stack,
  Rating,
  Modal,
  TextField,
  MenuItem,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import WorkIcon from "@mui/icons-material/Work";
import EmailIcon from "@mui/icons-material/Email";
import LanguageIcon from "@mui/icons-material/Language";
import axios from "axios";

const experienceLevels = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "expert", label: "Expert" },
];

const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState({
    display_name: "",
    bio: "",
    avatar_url: "",
    experience_level: "",
    portfolio_url: "",
    skills: [],
  });
  const [allSkills, setAllSkills] = useState([]);
  const [loadingSkills, setLoadingSkills] = useState(false);

  // Fetch profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("/api/users/profile", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setProfile(res.data);
        setForm({
          display_name: res.data.display_name || "",
          bio: res.data.bio || "",
          avatar_url: res.data.avatar_url || "",
          experience_level: res.data.experience_level || "",
          portfolio_url: res.data.portfolio_url || "",
          skills: res.data.skills?.map((s) => s.id) || [],
        });
      } catch (e) {
        setProfile(null);
      }
    };
    fetchProfile();
  }, []);

  // Fetch all skills for selection when editing
  const fetchSkills = async () => {
    setLoadingSkills(true);
    try {
      const res = await axios.get("/api/skills");
      setAllSkills(res.data);
    } catch (e) {
      setAllSkills([]);
    }
    setLoadingSkills(false);
  };

  const handleEdit = () => {
    fetchSkills();
    setEditOpen(true);
  };
  const handleClose = () => setEditOpen(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSkillChange = (e) => {
    setForm({ ...form, skills: e.target.value });
  };

  const handleSave = async () => {
    try {
      await axios.put(
        "/api/users/profile",
        form,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setEditOpen(false);
      // Refetch profile after save
      const res = await axios.get("/api/users/profile", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setProfile(res.data);
      setForm({
        display_name: res.data.display_name || "",
        bio: res.data.bio || "",
        avatar_url: res.data.avatar_url || "",
        experience_level: res.data.experience_level || "",
        portfolio_url: res.data.portfolio_url || "",
        skills: res.data.skills?.map((s) => s.id) || [],
      });
    } catch (e) {
      alert("Failed to update profile.");
    }
  };

  if (!profile) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <Typography variant="h6" color="text.secondary">
          Loading profile...
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Card sx={{ maxWidth: 800, mx: "auto", mt: 4, p: 3, background: "#f8fafc" }}>
        {/* Banner & Avatar */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Avatar
            src={profile.avatar_url}
            alt={profile.display_name}
            sx={{ width: 96, height: 96, mr: 3, border: "3px solid #1976d2" }}
          />
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h5" fontWeight="bold">
              {profile.display_name}
            </Typography>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 0.5 }}>
              <Rating
                value={profile.rating || 0}
                precision={0.1}
                readOnly
                size="small"
                icon={<StarIcon fontSize="inherit" />}
                emptyIcon={<StarIcon fontSize="inherit" />}
              />
              <Typography variant="body2" color="text.secondary">
                {profile.rating?.toFixed(1) || "0.0"} ({profile.review_count || 0} reviews)
              </Typography>
            </Stack>
            <Typography variant="subtitle1" sx={{ mt: 1 }}>
              {profile.role || "Freelancer"} - {profile.profession || "Web3 Expert"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <WorkIcon sx={{ fontSize: 18, mr: 0.5, verticalAlign: "middle" }} />
              {profile.completed_jobs || 0} Completed Jobs
            </Typography>
          </Box>
          {/* Action Buttons */}
          <Stack spacing={1}>
            <Button variant="contained" color="primary" startIcon={<EmailIcon />}>
              Message
            </Button>
            <Button variant="outlined" color="success">
              Hire
            </Button>
            <Button variant="outlined" color="secondary" onClick={handleEdit}>
              Edit Profile
            </Button>
          </Stack>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Bio Section */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Bio
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {profile.bio || "No bio provided."}
          </Typography>
        </Box>

        {/* Skills Section */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Skills
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {profile.skills && profile.skills.length > 0 ? (
              profile.skills.map((skill) => (
                <Chip key={skill.id} label={skill.name} color="primary" variant="outlined" />
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                No skills listed.
              </Typography>
            )}
          </Box>
        </Box>

        {/* Portfolio Section */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Portfolio
          </Typography>
          {profile.portfolio_url ? (
            <Link href={profile.portfolio_url} target="_blank" rel="noopener" underline="hover">
              <LanguageIcon sx={{ mr: 1, verticalAlign: "middle" }} />
              {profile.portfolio_url}
            </Link>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No portfolio provided.
            </Typography>
          )}
        </Box>
      </Card>

      {/* Edit Modal */}
      <Modal open={editOpen} onClose={handleClose}>
        <Box sx={{
          p: 4,
          bgcolor: "#fff",
          maxWidth: 500,
          mx: "auto",
          mt: 8,
          borderRadius: 2,
          boxShadow: 24,
        }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>Edit Profile</Typography>
          <TextField
            label="Display Name"
            name="display_name"
            value={form.display_name}
            onChange={handleChange}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Bio"
            name="bio"
            value={form.bio}
            onChange={handleChange}
            fullWidth
            multiline
            sx={{ mb: 2 }}
          />
          <TextField
            label="Avatar URL"
            name="avatar_url"
            value={form.avatar_url}
            onChange={handleChange}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Portfolio URL"
            name="portfolio_url"
            value={form.portfolio_url}
            onChange={handleChange}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            select
            label="Experience Level"
            name="experience_level"
            value={form.experience_level}
            onChange={handleChange}
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
            onChange={handleSkillChange}
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
            <Button onClick={handleClose}>Cancel</Button>
            <Button variant="contained" onClick={handleSave}>Save</Button>
          </Stack>
        </Box>
      </Modal>
    </>
  );
};

export default UserProfile;