import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import axios from "axios";
import config from "../../config";
import { useNavigate } from "react-router-dom";

function LoginForm({ onAuthSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${config.API_BASE_URL}/api/auth/login`, { email, password });
      const { token } = response.data;
      localStorage.setItem("token", token);
      if (onAuthSuccess) onAuthSuccess(token);
      setMessage("Login successful!");
      navigate("/home"); // Redirect to home page after login
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
      <h2>Login</h2>
      {message && <Alert variant={message.startsWith("Error") ? "danger" : "success"}>{message}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="email" className="mb-2">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        </Form.Group>
        <Form.Group controlId="password" className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </Form.Group>
        <Button variant="primary" type="submit">
          Login
        </Button>
      </Form>
    </div>
  );
}

export default LoginForm;