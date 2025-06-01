import React from "react";
import { Box, Typography, Link, Stack } from "@mui/material";

function Footer() {
  return (
    <Box
      sx={{
        bgcolor: "primary.main",
        color: "white",
        textAlign: "center",
        py: { xs: 2, sm: 3 },
        mt: 4,
        boxShadow: "0 -2px 8px rgba(0,0,0,0.04)",
      }}
    >
      <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 1 }}>
        <Link href="mailto:support@chaingigs.com" color="inherit" underline="hover">
          Contact
        </Link>
        <Link href="https://github.com/yourproject" color="inherit" underline="hover" target="_blank" rel="noopener">
          GitHub
        </Link>
      </Stack>
      <Typography
        variant="body2"
        sx={{
          fontSize: { xs: "0.8rem", sm: "1rem" },
        }}
      >
        © {new Date().getFullYear()} Chain Gigs. All rights reserved.
      </Typography>
    </Box>
  );
}

export default Footer;