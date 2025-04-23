import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";

function Header({ account, onLogout }) {
  return (
    <AppBar position="static" color="primary">
      <Toolbar sx={{ flexWrap: "wrap" }}>
        <Typography
          variant="h6"
          sx={{
            flexGrow: 1,
            fontSize: { xs: "1rem", sm: "1.5rem" }, // Responsive font size
          }}
        >
          Chain Gigs
        </Typography>
        {account ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" }, // Stack on small screens
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <Typography
              variant="body2"
              sx={{
                display: "inline",
                mr: { sm: 2 }, // Add margin only on larger screens
                mb: { xs: 1, sm: 0 }, // Add margin-bottom on small screens
                fontSize: { xs: "0.8rem", sm: "1rem" }, // Responsive font size
              }}
            >
              Connected as: {account}
            </Typography>
            <Button
              color="inherit"
              onClick={onLogout}
              sx={{
                fontSize: { xs: "0.8rem", sm: "1rem" }, // Responsive font size
              }}
            >
              Logout
            </Button>
          </Box>
        ) : (
          <Typography
            variant="body2"
            sx={{
              fontSize: { xs: "0.8rem", sm: "1rem" }, // Responsive font size
            }}
          >
            Please connect your wallet
          </Typography>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Header;