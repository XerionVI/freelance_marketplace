import React, { useState } from "react";
import { Form, Button, Alert, Row, Col } from "react-bootstrap";
import axios from "axios";
import config from "../../config";

function RegistrationForm({ onRegisterSuccess, onConnectWallet, walletAddress }) {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    display_name: "",
    wallet_address: walletAddress || "",
    role: "freelancer",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleConnectWallet = async () => {
    // Example using MetaMask
    if (window.ethereum) {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      setForm({ ...form, wallet_address: accounts[0] });
      if (onConnectWallet) onConnectWallet(accounts[0]);
    } else {
      setMessage("MetaMask not found.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${config.API_BASE_URL}/api/auth/register`, form);
      setMessage("Account created successfully! You can now log in.");
      if (onRegisterSuccess) onRegisterSuccess();
    } catch (error) {
      if (error.response?.data?.errors) {
        setMessage("Error: " + error.response.data.errors.map((err) => err.msg).join(", "));
      } else if (error.response?.data?.msg) {
        setMessage("Error: " + error.response.data.msg);
      } else {
        setMessage("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div>
      <h2>Create Account</h2>
      {message && <Alert variant={message.startsWith("Error") ? "danger" : "success"}>{message}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="username" className="mb-2">
          <Form.Label>Username</Form.Label>
          <Form.Control name="username" value={form.username} onChange={handleChange} required />
        </Form.Group>
        <Form.Group controlId="email" className="mb-2">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" name="email" value={form.email} onChange={handleChange} required />
        </Form.Group>
        <Form.Group controlId="password" className="mb-2">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" name="password" value={form.password} onChange={handleChange} required />
        </Form.Group>
        <Form.Group controlId="display_name" className="mb-2">
          <Form.Label>Display Name</Form.Label>
          <Form.Control name="display_name" value={form.display_name} onChange={handleChange} required />
        </Form.Group>
        <Form.Group controlId="wallet_address" className="mb-2">
          <Form.Label>Wallet Address</Form.Label>
          <Row>
            <Col>
              <Form.Control
                name="wallet_address"
                value={form.wallet_address}
                onChange={handleChange}
                readOnly
                required
              />
            </Col>
            <Col xs="auto">
              <Button variant="secondary" onClick={handleConnectWallet}>
                Connect Wallet
              </Button>
            </Col>
          </Row>
        </Form.Group>
        <Form.Group controlId="role" className="mb-3">
          <Form.Label>Role</Form.Label>
          <div>
            <Form.Check
              inline
              label="Freelancer"
              name="role"
              type="radio"
              value="freelancer"
              checked={form.role === "freelancer"}
              onChange={handleChange}
            />
            <Form.Check
              inline
              label="Client"
              name="role"
              type="radio"
              value="client"
              checked={form.role === "client"}
              onChange={handleChange}
            />
          </div>
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </div>
  );
}

export default RegistrationForm;