import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import UserReviewsCard from "./UserReviewsCard";
import ChatBoxHome from "../chatBox/ChatBoxHome";

import axios from "axios";
import UserModal from "./UserModal";
import AvatarModal from "./AvatarModal";
import HireModal from "./HireModal";

import config from "../../config";

const experienceLevels = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "expert", label: "Expert" },
];

const UserProfile = ({ profile: propProfile, account }) => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState({
    display_name: "",
    bio: "",
    avatar_url: "",
    experience_level: "",
    hourly_rate: "",
    portfolio_url: "",
    skills: [],
  });
  const [allSkills, setAllSkills] = useState([]);
  const [loadingSkills, setLoadingSkills] = useState(false);
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [avatarHover, setAvatarHover] = useState(false);
  const [jobModalOpen, setJobModalOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedConvId, setSelectedConvId] = useState(null);

  const handleOpenChat = async () => {
    const loggedInUserId = getUserIdFromToken();
    // If self, just open chatbox in self mode (no conversation)
    if (
      !profile ||
      !loggedInUserId ||
      Number(profile.id) === Number(loggedInUserId)
    ) {
      setSelectedConvId(null); // Ensure no conversation is selected
      setChatOpen(true);
      return;
    }
    try {
      // Fetch all conversations for the current user
      const res = await axios.get(`${config.API_BASE_URL}/api/conversations`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      // Try to find a conversation with this profile user
      const existing = res.data.find(
        (conv) =>
          conv.otherUserId === profile.id ||
          conv.otherUserId === Number(profile.id)
      );
      if (existing) {
        setSelectedConvId(existing.id);
        setChatOpen(true);
      } else {
        // Start a new conversation
        const startRes = await axios.post(
          `${config.API_BASE_URL}/api/conversations/start`,
          { otherUserId: profile.id },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setSelectedConvId(startRes.data.id);
        setChatOpen(true);
      }
    } catch (e) {
      alert("Failed to open or start conversation.");
    }
  };
  // Handler for avatar upload
  const handleAvatarUpload = async (file) => {
    setAvatarLoading(true);
    try {
      // You should implement the backend endpoint for avatar upload
      const formData = new FormData();
      formData.append("avatar", file);

      const res = await axios.post(`${config.API_BASE_URL}/api/users/avatar`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });
      // Update avatar in profile
      setProfile((prev) => ({
        ...prev,
        avatar_url: res.data.avatar_url,
      }));
      setForm((prev) => ({
        ...prev,
        avatar_url: res.data.avatar_url,
      }));
      setAvatarModalOpen(false);
    } catch (e) {
      alert("Failed to upload avatar.");
    }
    setAvatarLoading(false);
  };

  // Fetch profile on mount or when id changes
  useEffect(() => {
    // If profile is passed as prop, use it (for SSR or prefetch)
    if (propProfile) {
      setProfile(propProfile);
      return;
    }
    const fetchProfile = async () => {
      try {
        let res;
        if (id) {
          // Public profile (no token)
          res = await axios.get(`${config.API_BASE_URL}/api/users/${id}/profile`);
        } else {
          // Own profile (token required)
          res = await axios.get(`${config.API_BASE_URL}/api/users/profile`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
        }
        setProfile(res.data);
        setForm({
          display_name: res.data.display_name || "",
          bio: res.data.bio || "",
          avatar_url: res.data.avatar_url || "",
          hourly_rate: res.data.hourly_rate || "",
          experience_level: res.data.experience_level || "",
          portfolio_url: res.data.portfolio_url || "",
          skills: res.data.skills?.map((s) => s.id) || [],
        });
      } catch (e) {
        setProfile(null);
      }
    };
    fetchProfile();
  }, [id, propProfile]);

  function getUserIdFromToken() {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.user?.id || null;
    } catch {
      return null;
    }
  }

  const loggedInUserId = getUserIdFromToken();
  const isSelf = !!profile && Number(profile.id) === Number(loggedInUserId);
  // Only allow editing if not in preview mode
  const canEdit = !id;

  // Fetch all skills for selection when editing
  const fetchSkills = async () => {
    setLoadingSkills(true);
    try {
      const res = await axios.get(`${config.API_BASE_URL}/api/skills`);
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
      await axios.put(`${config.API_BASE_URL}/api/users/profile`, form, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setEditOpen(false);
      // Refetch profile after save
      const res = await axios.get(`${config.API_BASE_URL}/api/users/profile`, {
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
      <Card
        sx={{ maxWidth: 800, mx: "auto", mt: 4, p: 3, background: "#f8fafc" }}
      >
        {/* Banner & Avatar */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Box
            sx={{ position: "relative", mr: 3, width: 96, height: 96 }}
            onMouseEnter={() => setAvatarHover(true)}
            onMouseLeave={() => setAvatarHover(false)}
          >
            <Avatar
              src={
                profile.avatar_url
                  ? profile.avatar_url.startsWith("http")
                    ? profile.avatar_url
                    : `${config.API_BASE_URL}${profile.avatar_url}`
                  : undefined
              }
              alt={profile.display_name}
              sx={{
                width: 96,
                height: 96,
                border: "3px solid #1976d2",
                filter: avatarHover ? "blur(2px) brightness(0.8)" : "none",
                transition: "filter 0.2s",
                cursor: "pointer",
              }}
            />
            {avatarHover && (
              <Button
                onClick={() => setAvatarModalOpen(true)}
                sx={{
                  minWidth: 0,
                  p: 1,
                  bgcolor: "rgba(25, 118, 210, 0.7)",
                  color: "#fff",
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  borderRadius: "50%",
                  boxShadow: 2,
                  zIndex: 2,
                  "&:hover": {
                    bgcolor: "rgba(25, 118, 210, 0.9)",
                  },
                }}
              >
                <PhotoCameraIcon fontSize="medium" />
              </Button>
            )}
          </Box>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h5" fontWeight="bold">
              {profile.display_name}
            </Typography>
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{ mt: 0.5 }}
            >
              <Rating
                value={profile.rating || 0}
                precision={0.1}
                readOnly
                size="small"
                icon={<StarIcon fontSize="inherit" />}
                emptyIcon={<StarIcon fontSize="inherit" />}
              />
              <Typography variant="body2" color="text.secondary">
                {profile.rating?.toFixed(1) || "0.0"} (
                {profile.review_count || 0} reviews)
              </Typography>
            </Stack>
            <Typography variant="subtitle1" sx={{ mt: 1 }}>
              {profile.role || "Freelancer"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <WorkIcon
                sx={{ fontSize: 18, mr: 0.5, verticalAlign: "middle" }}
              />
              {profile.completed_jobs || 0} Completed Jobs
            </Typography>
            {/* Hourly Rate */}
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              <b>Hourly Rate:</b> {profile.hourly_rate} ETH
            </Typography>
          </Box>
          {/* Action Buttons */}
          <Stack spacing={1}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<EmailIcon />}
              onClick={handleOpenChat}
              disabled={
                !localStorage.getItem("token") ||
                !account ||
                !profile.wallet_address
              }
            >
              {isSelf ? "Open Chat" : "Message"}
            </Button>
            <Button
              variant="outlined"
              color="success"
              onClick={() => setJobModalOpen(true)}
              disabled={
                !account ||
                !profile.wallet_address ||
                account.toLowerCase() === profile.wallet_address.toLowerCase()
              }
            >
              Hire
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleEdit}
              disabled={
                !account ||
                !profile.wallet_address ||
                account.toLowerCase() !== profile.wallet_address.toLowerCase()
              }
            >
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
                <Chip
                  key={skill.id}
                  label={skill.name}
                  color="primary"
                  variant="outlined"
                />
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
            <Link
              href={profile.portfolio_url}
              target="_blank"
              rel="noopener"
              underline="hover"
            >
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
      {profile && <UserReviewsCard userId={profile.id} />}
      {/* Avatar Modal and Edit Modal only if canEdit */}
      {canEdit && (
        <>
          <UserModal
            open={editOpen}
            onClose={handleClose}
            form={form}
            onChange={handleChange}
            onSkillChange={handleSkillChange}
            onSave={handleSave}
            experienceLevels={experienceLevels}
            allSkills={allSkills}
            loadingSkills={loadingSkills}
          />
          <AvatarModal
            open={avatarModalOpen}
            onClose={() => setAvatarModalOpen(false)}
            onUpload={handleAvatarUpload}
            loading={avatarLoading}
            currentAvatar={profile.avatar_url}
          />
        </>
      )}
      {/* Job Creation Modal */}
      <HireModal
        open={jobModalOpen}
        onClose={() => setJobModalOpen(false)}
        freelancerAddress={profile.wallet_address}
        account={account}
        onJobCreated={() => setJobModalOpen(false)}
      />
      {/* Chat Box */}
      {chatOpen && (
        <Modal open={chatOpen} onClose={() => setChatOpen(false)}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              minWidth: 400,
              minHeight: 400,
            }}
          >
            <ChatBoxHome
              token={localStorage.getItem("token")}
              account={account}
              userId={loggedInUserId}
              otherUserId={profile.id}
              initialConversationId={selectedConvId}
              isSelf={isSelf}
            />
          </Box>
        </Modal>
      )}
    </>
  );
};

export default UserProfile;
