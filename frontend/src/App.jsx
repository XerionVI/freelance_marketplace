import React, { useState, useEffect } from "react";
import axios from "axios";

import Layout from "./components/shared/layout/Layout";
import AppRoutes from "./routes/AppRoutes";

import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import listenForJobCreated from "./utils/listenForJobCreated";
import { ethers } from "ethers";

function App() {
  const [account, setAccount] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));


  useEffect(() => {
    const connectWallet = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
          const normalizedAccount = ethers.getAddress(accounts[0]);
          setAccount(normalizedAccount);

          listenForJobCreated(normalizedAccount);

          window.ethereum.on("accountsChanged", (accounts) => {
            if (accounts.length > 0) {
              const normalizedChangedAccount = ethers.getAddress(accounts[0]);
              setAccount(normalizedChangedAccount);
              listenForJobCreated(normalizedChangedAccount);
            } else {
              setAccount(null);
            }
          });
        } catch (error) {
          console.error("Error connecting to MetaMask:", error);
        }
      } else {
        console.error("MetaMask is not installed.");
      }
    };

    connectWallet();
  }, []);

  const fetchUsername = async () => {
    if (!token) return;
    try {
      const response = await axios.get("http://localhost:5000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsername(response.data.username);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        handleLogout();
      }
    }
  };
  useEffect(() => {
    if (token) {
      fetchUsername();
    }
  }, [account, token]);

  const handleAuthSuccess = (token) => {
    localStorage.setItem("token", token);
    setToken(token);
    fetchUsername();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <Router>
      <Layout account={account} token={token} onLogout={handleLogout}>
        <AppRoutes
          account={account}
          token={token}
          handleAuthSuccess={handleAuthSuccess}
          handleLogin={() => window.location.replace("/auth")}
          handleRegister={() => window.location.replace("/auth")}
        />
      </Layout>
    </Router>
  );
}

export default App;