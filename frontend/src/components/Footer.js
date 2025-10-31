import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-dark text-white pt-5 pb-4 mt-auto">
      <Container>
        {/* === Main Footer Columns === */}
        <Row className="text-center text-md-start">
          {/* === About Section === */}
          <Col md={3} className="mb-4">
            <h6 className="text-uppercase fw-bold text-info">
              About Finance IO
            </h6>
            <p className="small text-muted">
              Finance IO empowers investors with AI-driven insights, real-time
              portfolio analysis, and intelligent market forecasting.
            </p>
          </Col>

          {/* === Features Section === */}
          <Col md={3} className="mb-4">
            <h6 className="text-uppercase fw-bold text-info">Features</h6>
            <ul className="list-unstyled small">
              <li>AI Portfolio Analysis</li>
              <li>Automated Risk Scoring</li>
              <li>Asset Performance Tracking</li>
              <li>Personalized Investment Insights</li>
            </ul>
          </Col>

          {/* === Resources Section === */}
          <Col md={3} className="mb-4">
            <h6 className="text-uppercase fw-bold text-info">Resources</h6>
            <ul className="list-unstyled small">
              <li>Developer API Docs</li>
              <li>Investment Strategies Guide</li>
              <li>Terms & Privacy Policy</li>
              <li>Support Center</li>
            </ul>
          </Col>

          {/* === Social Media Section === */}
          <Col md={3} className="text-center">
            <h6 className="text-uppercase fw-bold text-info">
              Connect With Us
            </h6>
            <div className="d-flex justify-content-center gap-3 fs-5 mt-2">
              <a href="#" className="text-white hover-opacity" title="YouTube">
                <FaYoutube />
              </a>
              <a href="#" className="text-white hover-opacity" title="Twitter">
                <FaTwitter />
              </a>
              <a href="#" className="text-white hover-opacity" title="LinkedIn">
                <FaLinkedin />
              </a>
              <a href="#" className="text-white hover-opacity" title="Facebook">
                <FaFacebook />
              </a>
              <a
                href="#"
                className="text-white hover-opacity"
                title="Instagram"
              >
                <FaInstagram />
              </a>
            </div>
          </Col>
        </Row>

        {/* === Divider === */}
        <hr className="border-secondary" />

        {/* === Bottom Line === */}
        <Row>
          <Col className="text-center">
            <p className="text-muted small mb-0">
              &copy; {new Date().getFullYear()} <strong>Finance IO</strong> —
              Empowering smarter, data-driven investment decisions.
              <br />
              Built with ❤️ by the Finance IO Engineering Team.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}
