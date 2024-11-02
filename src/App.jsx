import React, { useEffect, useState } from "react";
import CreateJobForm from "./components/CreateJobForm.jsx";
import ApproveJob from "./components/ApproveJob.jsx";
import ReleaseFunds from "./components/ReleaseFunds.jsx";
import { Container, Row, Col, Alert, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
    const [account, setAccount] = useState(null);

    // Prompt the user to connect MetaMask on load
    useEffect(() => {
        const connectWallet = async () => {
            if (window.ethereum) {
                try {
                    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
                    setAccount(accounts[0]);
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
                    <CreateJobForm />
                    <hr />
                    <ApproveJob />
                    <hr />
                    <ReleaseFunds />
                </Col>
            </Row>
        </Container>
    );
}

export default App;
