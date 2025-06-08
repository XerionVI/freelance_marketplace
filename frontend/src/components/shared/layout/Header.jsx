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

  const menuLinks = [
    { label: "Home", to: "/home" },
    { label: "Transaction", to: "/transaction" },
    { label: "Browse Freelancers", to: "/freelancer-home" },
    { label: "Browse Jobs", to: "/listings" },
    { label: "Job Management", to: "/job-management" },
    { label: "Disputes", to: "/disputes", icon: <GavelIcon fontSize="small" sx={{ mr: 1 }} /> },
  ];

   const handleLogout = () => {
    onLogout();
    navigate("/auth");
  };

  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  return (
    <AppBar position="static" color="primary" elevation={2}>
    <Toolbar sx={{ flexWrap: "wrap", px: { xs: 1, sm: 3 } }}>
      {/* Logo and Brand */}
      <Box sx={{ display: "flex", alignItems: "center", cursor: "pointer", mr: 2 }} onClick={() => navigate("/")}>
        <img
          src={logo}
          alt="Chain Gigs Logo"
          style={{ width: 40, height: 40, marginRight: 12, borderRadius: "50%" }}
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
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
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
              display: "inline",
              mr: 1,
              fontSize: { xs: "0.8rem", sm: "1rem" },
              bgcolor: "primary.light",
              px: 1.5,
              py: 0.5,
              borderRadius: 2,
            }}
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
              {!avatar_url
                ? getInitials(displayName)
                : null}
            </Avatar>
          </IconButton>
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
        </Box>
      )}
      {!token && (
        <Button color="inherit" component={RouterLink} to="/auth" sx={{ ml: 2 }}>
          Login
        </Button>
      )}
    </Toolbar>
  </AppBar>
);
}

export default Header;