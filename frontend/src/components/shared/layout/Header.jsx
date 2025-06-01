import React from "react";
import { AppBar, Toolbar, Typography, Button, Box, Avatar, IconButton, Stack } from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import logo from "../../../assets/chainGigs.png";

function shortenAddress(address) {
  if (!address) return "";
  return address.slice(0, 6) + "..." + address.slice(-4);
}

function Header({ account, token, onLogout, onProfile }) {
  const navigate = useNavigate();

  return (
    <AppBar position="static" color="primary" elevation={2}>
      <Toolbar sx={{ flexWrap: "wrap", px: { xs: 1, sm: 3 } }}>
        <Box sx={{ display: "flex", alignItems: "center", cursor: "pointer" }} onClick={() => navigate("/")}>
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
        <Stack direction="row" spacing={2} sx={{ flexGrow: 1, ml: 4 }}>
          <Button color="inherit" component={RouterLink} to="/home">
            Home
          </Button>
          <Button color="inherit" component={RouterLink} to="/">
            Transaction
          </Button>
          <Button color="inherit" component={RouterLink} to="/browse">
            Browse Freelancers
          </Button>
          <Button color="inherit" component={RouterLink} to="/post-job">
            Post a Job
          </Button>
        </Stack>
        {token ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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
              <Avatar sx={{ width: 28, height: 28, bgcolor: "secondary.main" }}>
                {account ? account.slice(2, 4).toUpperCase() : "U"}
              </Avatar>
            </IconButton>
            <Button
              color="inherit"
              onClick={onLogout}
              sx={{
                fontSize: { xs: "0.8rem", sm: "1rem" },
                ml: 1,
              }}
            >
              Logout
            </Button>
          </Box>
        ) : (
          <Box>
            <Button color="inherit" component={RouterLink} to="/auth">
              Login / Register
            </Button>

          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Header;