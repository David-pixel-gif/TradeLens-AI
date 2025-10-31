import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaChartLine,
  FaChartPie,
  FaSignOutAlt,
  FaUserCircle,
  FaBell,
  FaLightbulb,
} from "react-icons/fa";
//mport "../styles/HomePage.css";

export default function HomePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const BASE_URL = "http://localhost:5000/api";

  // ✅ Fetch logged-in user on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          // if no token, redirect to login
          navigate("/login");
          return;
        }

        const res = await axios.get(`${BASE_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data?.user) setUser(res.data.user);
        else navigate("/login");
      } catch (err) {
        console.error("Failed to fetch user:", err);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  // ✅ Secure logout
  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    localStorage.setItem("loggedOut", "true");

    // prevent back navigation
    window.history.pushState(null, "", "/landing");
    window.onpopstate = () => window.history.pushState(null, "", "/landing");
    navigate("/landing", { replace: true });
  };

  if (loading) {
    return (
      <div className="vh-100 d-flex flex-column justify-content-center align-items-center bg-light">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3 fw-bold text-primary">Preparing your dashboard...</p>
      </div>
    );
  }

  // ✅ Main Logged-In Homepage
  return (
    <div className="homepage-wrapper text-white text-center">
      <Container className="py-5">
        {/* ===== Header ===== */}
        <h1 className="fw-bold mb-2 display-5">Welcome to Finance IO</h1>
        <p className="lead text-light-emphasis mb-5">
          AI-driven investment insights and smart portfolio analytics.
        </p>

        {/* ===== Welcome Block ===== */}
        <div className="mb-5">
          <h5 className="fw-semibold text-info">
            <FaUserCircle className="me-2" />
            Hello {user?.name || "Investor"} 👋
          </h5>
          <p className="text-white-50 small">
            Ready to make data-driven financial moves today?
          </p>
        </div>

        {/* ===== Navigation Cards ===== */}
        <Row className="justify-content-center g-4">
          <Col md={3} sm={6}>
            <Card
              className="homepage-card"
              onClick={() => navigate("/dashboard")}
            >
              <Card.Body>
                <FaChartLine size={45} className="text-primary mb-3" />
                <h5 className="fw-bold">Dashboard</h5>
                <p className="small text-muted">
                  Track portfolio growth, returns, and daily performance.
                </p>
              </Card.Body>
            </Card>
          </Col>

          <Col md={3} sm={6}>
            <Card
              className="homepage-card"
              onClick={() => navigate("/analytics")}
            >
              <Card.Body>
                <FaChartPie size={45} className="text-success mb-3" />
                <h5 className="fw-bold">Analytics</h5>
                <p className="small text-muted">
                  Deep-dive into AI-powered insights and trends.
                </p>
              </Card.Body>
            </Card>
          </Col>

          <Col md={3} sm={6}>
            <Card
              className="homepage-card"
              onClick={() => navigate("/notifications")}
            >
              <Card.Body>
                <FaBell size={45} className="text-warning mb-3" />
                <h5 className="fw-bold">Notifications</h5>
                <p className="small text-muted">
                  Market news, stock alerts, and AI investment tips.
                </p>
              </Card.Body>
            </Card>
          </Col>

          <Col md={3} sm={6}>
            <Card className="homepage-card" onClick={handleLogout}>
              <Card.Body>
                <FaSignOutAlt size={45} className="text-danger mb-3" />
                <h5 className="fw-bold">Logout</h5>
                <p className="small text-muted">
                  Sign out securely and protect your session.
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* ===== Info Section ===== */}
        <div className="mt-5 fade-in">
          <FaLightbulb size={40} className="text-warning mb-3" />
          <h4 className="fw-bold">Why Finance IO?</h4>
          <p className="text-white-50 small w-75 mx-auto">
            Finance IO empowers you with AI-driven predictions, personalized
            analytics, and real-time alerts—helping you stay ahead in every
            market move. Navigate smarter, invest better.
          </p>
        </div>
      </Container>
    </div>
  );
}
