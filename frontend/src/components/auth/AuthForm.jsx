import React, { useState } from "react";
import LoginForm from "./LoginForm";
import RegistrationForm from "./RegistrationForm";
import { Button } from "react-bootstrap";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

function AuthForm({ onAuthSuccess }) {
  const [showLogin, setShowLogin] = useState(true);
  const [walletAddress, setWalletAddress] = useState("");

  const handleRegisterSuccess = () => {
    setShowLogin(true);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 6,
      }}
    >
      <Card
        sx={{
          minWidth: 340,
          maxWidth: 400,
          mx: "auto",
          borderRadius: 4,
          boxShadow: "0 8px 32px rgba(31,38,135,0.18)",
          background: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(8px)",
        }}
      >
        <CardContent>
          {showLogin ? (
            <>
              <LoginForm onAuthSuccess={onAuthSuccess} />
              <div style={{ marginTop: 16, textAlign: "center" }}>
                <span>Don't have an account? </span>
                <Button variant="link" onClick={() => setShowLogin(false)}>
                  Register
                </Button>
              </div>
            </>
          ) : (
            <>
              <RegistrationForm
                onRegisterSuccess={handleRegisterSuccess}
                walletAddress={walletAddress}
                onConnectWallet={setWalletAddress}
              />
              <div style={{ marginTop: 16, textAlign: "center" }}>
                <span>Already have an account? </span>
                <Button variant="link" onClick={() => setShowLogin(true)}>
                  Login
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}

export default AuthForm;