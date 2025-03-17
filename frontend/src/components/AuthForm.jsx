// filepath: d:\Project TA\freelance_marketplace\frontend\src\components\AuthForm.jsx
import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import axios from "axios";

function AuthForm({ isLogin, onAuthSuccess }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isLogin ? "http://localhost:5000/api/auth/login" : "http://localhost:5000/api/auth/register";
      const payload = isLogin ? { email, password } : { username, email, password };
      const response = await axios.post(endpoint, payload);
      const { token } = response.data;
      localStorage.setItem("token", token);
      onAuthSuccess(token);
      setMessage("Success!");
    } catch (error) {
      setMessage("Error: " + error.response.data.errors.map(err => err.msg).join(", "));
    }
  };

  return (
    <div>
      <h2>{isLogin ? "Login" : "Register"}</h2>
      {message && <Alert variant="info">{message}</Alert>}
      <Form onSubmit={handleSubmit}>
        {!isLogin && (
          <Form.Group controlId="username">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Form.Group>
        )}
        <Form.Group controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          {isLogin ? "Login" : "Register"}
        </Button>
      </Form>
    </div>
  );
}

export default AuthForm;