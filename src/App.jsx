import React, { useEffect, useState } from "react";
import CreateJobForm from "./components/CreateJobForm";
import DisputeList from "./components/DisputeList";
import { Container, Row, Col, Alert, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { getVotingDisputeResolutionContract } from "./utils/getVotingDisputeResolution";
import { getFreelanceEscrowContract } from "./utils/getFreelanceEscrow";

function App() {
  const [account, setAccount] = useState(null);
  const [disputes, setDisputes] = useState([]);
  const [votingDisputeResolution, setVotingDisputeResolution] = useState(null);
  const [freelanceEscrow, setFreelanceEscrow] = useState(null);

  // Prompt user to connect MetaMask on load
  useEffect(() => {
    const connectWallet = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
          setAccount(accounts[0]);

          const votingDisputeResolutionContract = getVotingDisputeResolutionContract();
          setVotingDisputeResolution(votingDisputeResolutionContract);

          const freelanceEscrowContract = getFreelanceEscrowContract();
          setFreelanceEscrow(freelanceEscrowContract);
        } catch (error) {
          console.error("User denied account access");
        }
      } else {
        alert("MetaMask is not installed. Please install it to use this app.");
      }
    };

    connectWallet();
  }, []);

  // Handle MetaMask account changes
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        setAccount(accounts[0] || null);
      });
    }
  }, []);

  // Fetch disputes from the contract
  useEffect(() => {
    const fetchDisputes = async () => {
      if (votingDisputeResolution) {
        const disputeCount = await votingDisputeResolution.methods.disputeCount().call();
        const disputesArray = [];
        for (let i = 0; i < disputeCount; i++) {
          const dispute = await votingDisputeResolution.methods.disputes(i).call();
          disputesArray.push(dispute);
        }
        setDisputes(disputesArray);
      }
    };

    fetchDisputes();
  }, [votingDisputeResolution]);

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
          <CreateJobForm freelanceEscrow={freelanceEscrow} account={account} />
        </Col>
      </Row>

      {/* Row for Dispute List */}
      <Row className="justify-content-center mt-4">
        <Col md={8}>
          <DisputeList disputes={disputes} account={account} votingDisputeResolution={votingDisputeResolution} />
        </Col>
      </Row>
    </Container>
  );
}

export default App;