import React, { useState, useEffect } from "react";
import { Form, Button, Card, Container, Alert } from "react-bootstrap";
import { FaUserShield } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/LoginPage.css"; // 👈 create this file

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Hide navbar/footer while on login page
  useEffect(() => {
    const layout = document.querySelector(".custom-navbar");
    const footer = document.querySelector("footer");
    if (layout) layout.style.display = "none";
    if (footer) footer.style.display = "none";
    return () => {
      if (layout) layout.style.display = "flex";
      if (footer) footer.style.display = "block";
    };
  }, []);

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      localStorage.setItem("authToken", res.data.token);
      navigate("/", { replace: true }); // ✅ go to HomePage after login
    } catch (err) {
      setMessage("❌ Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="login-page-container">
      {/* floating stock tickers */}
      <div className="floating-stocks">
        <span>AAPL ↑ 1.2%</span>
        <span>TSLA ↓ 0.8%</span>
        <span>AMZN ↑ 2.3%</span>
        <span>NFLX ↑ 0.9%</span>
      </div>

      {/* animated gradient background */}
      <div className="animated-bg"></div>

      {/* login form */}
      <Container className="d-flex align-items-center justify-content-center min-vh-100 position-relative">
        <Card className="login-card shadow-lg border-0 text-center p-4">
          <FaUserShield size={45} className="text-primary mb-3" />
          <h3 className="fw-bold mb-2">Welcome Back</h3>
          <p className="text-muted mb-4">
            Sign in to access your investment dashboard
          </p>

          {message && <Alert variant="danger">{message}</Alert>}

          <Form onSubmit={handleLogin}>
            <Form.Group className="mb-3 text-start" controlId="email">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-4 text-start" controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <Button type="submit" className="login-btn w-100 py-2 fw-semibold">
              Log In
            </Button>
          </Form>

          <p className="mt-4 small text-secondary">
            Don’t have an account?{" "}
            <a
              href="/register"
              className="text-decoration-none fw-bold text-primary"
            >
              Register
            </a>
          </p>
        </Card>
      </Container>
    </div>
  );
}
