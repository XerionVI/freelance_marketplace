import React from "react";
import { Box, Typography } from "@mui/material";

function Footer() {
  return (
    <Box
      sx={{
        bgcolor: "primary.main",
        color: "white",
        textAlign: "center",
        py: { xs: 2, sm: 3 }, // Responsive padding
        mt: 4,
      }}
    >
      <Typography
        variant="body2"
        sx={{
          fontSize: { xs: "0.8rem", sm: "1rem" }, // Responsive font size
        }}
      >
        © {new Date().getFullYear()} Chain Gigs. All rights reserved.
      </Typography>
    </Box>
  );
}

export default Footer;