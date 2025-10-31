import React, { useEffect, useState } from "react";
import {
  Navbar,
  Nav,
  Container,
  Button,
  Offcanvas,
  Dropdown,
  Spinner,
} from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaBars,
  FaSignOutAlt,
  FaBell,
  FaChartLine,
  FaChartPie,
  FaNewspaper,
  FaHome,
} from "react-icons/fa";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/CustomNavbar.css";

export default function CustomNavbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [user, setUser] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loadingRecs, setLoadingRecs] = useState(true);

  const BASE_URL = "http://localhost:5000/api";

  const handleClose = () => setShowMenu(false);
  const handleShow = () => setShowMenu(true);

  // =====================================================
  // 🔒 Secure Logout
  // =====================================================
  const handleLogout = async () => {
    try {
      await fetch(`${BASE_URL}/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }).catch(() => {});

      localStorage.clear();
      sessionStorage.clear();
      localStorage.setItem("loggedOut", "true");

      window.history.pushState(null, "", "/");
      window.onpopstate = () => window.history.pushState(null, "", "/");

      navigate("/", { replace: true });
    } catch (err) {
      console.error("Logout failed:", err);
      navigate("/", { replace: true });
    }
  };

  // =====================================================
  // 🧠 Fetch Logged-in User
  // =====================================================
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get(`${BASE_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data && res.data.user) {
          setUser(res.data.user);
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    fetchUser();
  }, []);

  // =====================================================
  // 📊 Fetch Daily AI Recommendations
  // =====================================================
  useEffect(() => {
    const fetchRecs = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/recommendation`);
        if (res.data && Array.isArray(res.data.recommendations)) {
          setRecommendations(res.data.recommendations);
        }
      } catch (err) {
        console.error("Error fetching recommendations:", err);
      } finally {
        setLoadingRecs(false);
      }
    };

    fetchRecs();
  }, []);

  // =====================================================
  // 🔍 Hide Navbar on Auth pages
  // =====================================================
  if (["/login", "/register"].includes(location.pathname)) return null;

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <Navbar
        expand="lg"
        className="custom-navbar sticky-top py-3 px-3 shadow-sm"
      >
        <Container fluid>
          {/* ✅ Brand */}
          <Navbar.Brand
            as={Link}
            to="/"
            className="fw-bold text-white fs-4"
            style={{ letterSpacing: "0.5px", cursor: "pointer" }}
          >
            Finance IO
          </Navbar.Brand>

          {/* 👋 User Welcome */}
          {user && (
            <span className="text-light ms-3 small fw-semibold">
              👋 Welcome, {user.name || "Investor"}!
            </span>
          )}

          {/* 📱 Mobile Toggle */}
          <Button
            variant="outline-light d-lg-none rounded-circle px-2"
            onClick={handleShow}
          >
            <FaBars />
          </Button>

          {/* 💻 Desktop Menu */}
          <Navbar.Collapse className="justify-content-end d-none d-lg-flex">
            <Nav className="align-items-center gap-3">
              {/* 🏠 Home */}
              <Nav.Link
                as={Link}
                to="/"
                className={`px-3 py-2 rounded-pill fw-semibold ${
                  isActive("/")
                    ? "bg-light text-dark"
                    : "text-white border border-light"
                }`}
              >
                <FaHome className="me-2" />
                Home
              </Nav.Link>

              <Nav.Link
                as={Link}
                to="/dashboard"
                className={`px-3 py-2 rounded-pill fw-semibold ${
                  isActive("/dashboard")
                    ? "bg-light text-dark"
                    : "text-white border border-light"
                }`}
              >
                <FaChartLine className="me-2" />
                Dashboard
              </Nav.Link>

              <Nav.Link
                as={Link}
                to="/analytics"
                className={`px-3 py-2 rounded-pill fw-semibold ${
                  isActive("/analytics")
                    ? "bg-light text-dark"
                    : "text-white border border-light"
                }`}
              >
                <FaChartPie className="me-2" />
                Analytics
              </Nav.Link>

              <Nav.Link
                as={Link}
                to="/notifications"
                className={`px-3 py-2 rounded-pill fw-semibold ${
                  isActive("/notifications")
                    ? "bg-light text-dark"
                    : "text-white border border-light"
                }`}
              >
                <FaNewspaper className="me-2" />
                Notifications
              </Nav.Link>

              {/* 🧠 AI Daily Insights Dropdown */}
              <Dropdown align="end" className="ms-2">
                <Dropdown.Toggle
                  variant="outline-light"
                  id="dropdown-recs"
                  className="rounded-circle p-2"
                  title="Daily AI Recommendations"
                >
                  <FaBell />
                </Dropdown.Toggle>

                <Dropdown.Menu className="dropdown-menu-end p-2 shadow">
                  <Dropdown.Header className="fw-bold text-primary">
                    🔍 Daily Investment Insights
                  </Dropdown.Header>
                  {loadingRecs ? (
                    <div className="text-center py-2">
                      <Spinner animation="border" size="sm" />
                    </div>
                  ) : recommendations.length > 0 ? (
                    recommendations.map((rec, idx) => (
                      <Dropdown.Item
                        key={idx}
                        href={rec.link || "#"}
                        target="_blank"
                        rel="noreferrer"
                        className="small text-wrap"
                      >
                        • {rec.title}
                      </Dropdown.Item>
                    ))
                  ) : (
                    <Dropdown.Item className="text-muted small">
                      No new insights today.
                    </Dropdown.Item>
                  )}
                </Dropdown.Menu>
              </Dropdown>

              {/* 🚪 Logout */}
              <Button
                variant="outline-light"
                className="ms-3 px-3 py-2 fw-semibold rounded-pill"
                onClick={handleLogout}
              >
                <FaSignOutAlt className="me-2" />
                Logout
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* 📱 Mobile Offcanvas */}
      <Offcanvas show={showMenu} onHide={handleClose} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title className="fw-bold text-primary">
            Finance IO Menu
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {user && (
            <div className="mb-3 text-center text-muted">
              👋 Welcome, <strong>{user.name}</strong>
            </div>
          )}

          <Nav className="flex-column">
            {/* 🏠 Home */}
            <Nav.Link
              as={Link}
              to="/"
              onClick={handleClose}
              className={`offcanvas-link ${
                isActive("/") ? "active-mobile" : ""
              }`}
            >
              <FaHome className="me-2" />
              Home
            </Nav.Link>

            <Nav.Link
              as={Link}
              to="/dashboard"
              onClick={handleClose}
              className={`offcanvas-link ${
                isActive("/dashboard") ? "active-mobile" : ""
              }`}
            >
              <FaChartLine className="me-2" />
              Dashboard
            </Nav.Link>

            <Nav.Link
              as={Link}
              to="/analytics"
              onClick={handleClose}
              className={`offcanvas-link ${
                isActive("/analytics") ? "active-mobile" : ""
              }`}
            >
              <FaChartPie className="me-2" />
              Analytics
            </Nav.Link>

            <Nav.Link
              as={Link}
              to="/notifications"
              onClick={handleClose}
              className={`offcanvas-link ${
                isActive("/notifications") ? "active-mobile" : ""
              }`}
            >
              <FaNewspaper className="me-2" />
              Notifications
            </Nav.Link>

            <hr />

            {/* 🧠 Daily Recommendations (Mobile) */}
            <div>
              <h6 className="fw-bold text-primary">AI Insights</h6>
              {loadingRecs ? (
                <p className="text-muted small">Loading...</p>
              ) : recommendations.length > 0 ? (
                <ul className="list-unstyled small">
                  {recommendations.map((rec, i) => (
                    <li key={i}>
                      <a
                        href={rec.link || "#"}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {rec.title}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted small">
                  No new recommendations today.
                </p>
              )}
            </div>

            <Button
              variant="outline-danger"
              onClick={() => {
                handleClose();
                handleLogout();
              }}
              className="w-100 mt-3"
            >
              <FaSignOutAlt className="me-2" />
              Logout
            </Button>
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}
