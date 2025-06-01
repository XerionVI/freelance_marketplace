import React, { useState } from "react";
import LoginForm from "./LoginForm";
import RegistrationForm from "./RegistrationForm";
import { Button } from "react-bootstrap";
import Box from "@mui/material/Box";

function AuthForm({ onAuthSuccess }) {
  const [showLogin, setShowLogin] = useState(true);

  // Optionally, you can pass wallet address state here if you want to share it between forms
  const [walletAddress, setWalletAddress] = useState("");

  const handleRegisterSuccess = () => {
    setShowLogin(true);
  };

  return (
    <Box>
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
    </Box>
  );
}

export default AuthForm;