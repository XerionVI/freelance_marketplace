import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Box, Container } from "@mui/material";

function Layout({ children, account, onLogout }) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Header */}
      <Header account={account} onLogout={onLogout} />

      {/* Main Content */}
      <Container
        maxWidth="lg"
        sx={{
          flex: 1, // Ensures the content area takes up available space
          mt: 4,
          mb: 4,
        }}
      >
        {children}
      </Container>

      {/* Footer */}
      <Footer />
    </Box>
  );
}

export default Layout;