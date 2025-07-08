import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  IconButton,
  Stack,
  Menu,
  MenuItem,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import GavelIcon from "@mui/icons-material/Gavel";
import HomeIcon from "@mui/icons-material/Home";
import HistoryIcon from "@mui/icons-material/History";
import PeopleIcon from "@mui/icons-material/People";
import WorkIcon from "@mui/icons-material/Work";
import AssignmentIcon from "@mui/icons-material/Assignment";

import { Link as RouterLink, useNavigate } from "react-router-dom";
import logo from "../../../assets/chainGigs.png";
import config from "../../../config";
import axios from "axios";

function shortenAddress(address) {
  if (!address) return "";
  return address.slice(0, 6) + "..." + address.slice(-4);
}

function getInitials(name, fallback = "U") {
  if (!name) return fallback;
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// ...existing imports...

function Header({ account, token, onLogout }) {
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width:900px)");
  const [anchorEl, setAnchorEl] = useState(null);
  const [profile, setProfile] = useState(null);

  // Fetch profile using token on mount or when token changes
  useEffect(() => {
    if (!token) {
      setProfile(null);
      return;
    }
    axios
      .get(`${config.API_BASE_URL}/api/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setProfile(res.data))
      .catch(() => setProfile(null));
  }, [token]);

  const avatar_url = profile?.avatar_url
    ? profile.avatar_url.startsWith("http")
      ? profile.avatar_url
      : `${config.API_BASE_URL}${profile.avatar_url}`
    : undefined;
  const displayName = profile?.display_name || profile?.username || "";

  // Only show these links when logged in
  const menuLinks = [
  { label: "Home", to: "/home", icon: <HomeIcon fontSize="small" sx={{ mr: 1 }} /> },
  ...(token
    ? [
        { label: "History", to: "/history", icon: <HistoryIcon fontSize="small" sx={{ mr: 1 }} /> },
        { label: "Browse Freelancers", to: "/freelancer-home", icon: <PeopleIcon fontSize="small" sx={{ mr: 1 }} /> },
        { label: "Browse Jobs", to: "/listings", icon: <WorkIcon fontSize="small" sx={{ mr: 1 }} /> },
        { label: "Job Management", to: "/job-management", icon: <AssignmentIcon fontSize="small" sx={{ mr: 1 }} /> },
        {
          label: "Disputes",
          to: "/disputes",
          icon: <GavelIcon fontSize="small" sx={{ mr: 1 }} />,
        },
      ]
    : []),
];

  const handleLogout = () => {
    onLogout();
    navigate("/auth");
  };

  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  return (
    <AppBar
      position="static"
      sx={{
        background: "#211C84",
        boxShadow: 2,
      }}
      elevation={2}
    >
      <Toolbar sx={{ flexWrap: "wrap", px: { xs: 1, sm: 3 } }}>
        {/* Logo and Brand */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            mr: 2,
          }}
          onClick={() => navigate("/")}
        >
          <img
            src={logo}
            alt="Chain Gigs Logo"
            style={{
              width: 40,
              height: 40,
              marginRight: 12,
              borderRadius: "50%",
            }}
          />
          <Typography
            variant="h6"
            sx={{
              fontSize: { xs: "1rem", sm: "1.5rem" },
              fontWeight: "bold",
              letterSpacing: 1,
            }}
          >
            Chain Gigs
          </Typography>
        </Box>
        {/* Navigation Links - stick to the left after logo */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {isMobile ? (
            <>
              <IconButton color="inherit" onClick={handleMenuOpen}>
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                {menuLinks.map((link) => (
                  <MenuItem
                    key={link.to}
                    component={RouterLink}
                    to={link.to}
                    onClick={handleMenuClose}
                  >
                    {link.icon}
                    {link.label}
                  </MenuItem>
                ))}
              </Menu>
            </>
          ) : (
            <Stack direction="row" spacing={2}>
              {menuLinks.map((link) => (
                <Button
                  key={link.to}
                  color="inherit"
                  component={RouterLink}
                  to={link.to}
                  startIcon={link.icon}
                >
                  {link.label}
                </Button>
              ))}
            </Stack>
          )}
        </Box>
        {/* Spacer to push account/profile to the right */}
        <Box sx={{ flexGrow: 1 }} />
        {/* Account/Profile and Logout/Login on the far right */}
        {token && profile && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, ml: 2 }}>
            <Typography
              variant="body2"
              sx={{
                display: "inline-flex",
                alignItems: "center",
                mr: 1,
                fontSize: { xs: "0.85rem", sm: "1rem" },
                bgcolor: "rgba(255,255,255,0.12)",
                color: "#fff",
                px: 1.5,
                py: 0.5,
                borderRadius: 2,
                fontFamily: "monospace",
                border: "1px solid #fff",
                boxShadow: "0 1px 4px rgba(33,28,132,0.08)",
                letterSpacing: "0.05em",
                cursor: "pointer",
                transition: "background 0.2s",
                "&:hover": {
                  bgcolor: "rgba(255,255,255,0.22)",
                },
              }}
              title={account}
              onClick={() => navigator.clipboard.writeText(account)}
            >
              {shortenAddress(account)}
            </Typography>
            <IconButton
              color="inherit"
              onClick={() => navigate("/profile")}
              sx={{ p: 0.5 }}
            >
              <Avatar
                src={avatar_url}
                sx={{ width: 28, height: 28, bgcolor: "secondary.main" }}
              >
                {!avatar_url ? getInitials(displayName) : null}
              </Avatar>
            </IconButton>
          </Box>
        )}
        {token && (
          <IconButton
            color="inherit"
            onClick={handleLogout}
            sx={{
              fontSize: { xs: "0.8rem", sm: "1rem" },
              ml: 1,
            }}
            title="logout?"
          >
            <ExitToAppIcon />
          </IconButton>
        )}
        {!token && (
          <Button
            color="inherit"
            component={RouterLink}
            to="/auth"
            sx={{ ml: 2 }}
          >
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Header;
