import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Box, Container } from "@mui/material";

function Layout({ account, token, onLogout, onProfile, children }) {
  return (
    <>
      <Header account={account} token={token} onLogout={onLogout} onProfile={onProfile} />
      <Box
        sx={{
          minHeight: "calc(100vh - 120px)", // Leaves space for header/footer
          background: "linear-gradient(to bottom, #211C84 0%, #B5A8D5 100%)",
          pt: { xs: 2, sm: 4 },
          pb: { xs: 2, sm: 4 },
        }}
      >
        <Container maxWidth="lg" sx={{ px: { xs: 1, sm: 3 } }}>
          {children}
        </Container>
      </Box>
      <Footer />
    </>
  );
}

export default Layout;