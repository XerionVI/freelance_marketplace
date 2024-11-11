import React, { useEffect, useState } from "react";
import CreateJobForm from "./components/CreateJobForm";
import { Container, Row, Col, Alert, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [account, setAccount] = useState(null);

  // Prompt user to connect MetaMask on load
  useEffect(() => {
    const connectWallet = async () => {
      if (window.ethereum) {
        try {
          // Request account access if needed
          const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
          console.log("Connected account:", accounts[0]);
          setAccount(accounts[0]);

          // Listen for account changes
          window.ethereum.on("accountsChanged", (accounts) => {
            setAccount(accounts[0] || null);
          });
        } catch (error) {
          console.error("User denied account access or an error occurred.");
          alert("Error connecting to MetaMask.");
        }
      } else {
        alert("MetaMask is not installed. Please install it to use this app.");
      }
    };

    connectWallet();
  }, []);

  return (
    <Container className="mt-5">
      <h1 className="text-center mb-4">Freelance Marketplace</h1>

      {/* Display user account if connected */}
      <div className="text-center mb-4">
        {account ? (
          <Alert variant="info">Connected as: {account}</Alert>
        ) : (
          <Button onClick={() => window.ethereum.request({ method: "eth_requestAccounts" })}>
            Connect MetaMask
          </Button>
        )}
      </div>

      {/* Row for Components */}
      <Row className="justify-content-center">
        <Col md={6}>
          <CreateJobForm account={account} />
        </Col>
      </Row>
    </Container>
  );
}

export default App;
