import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaChartLine,
  FaBrain,
  FaMoneyBillWave,
  FaHandsHelping,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
} from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import AOS from "aos";
import "aos/dist/aos.css";
import image01 from "../assets/image01.jpg";

export default function LandingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ once: true });
  }, []);

  return (
    <div
      className="bg-light text-dark min-vh-100 d-flex flex-column"
      style={{ fontFamily: "Open Sans, sans-serif" }}
    >
      {/* NavBar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom shadow-sm sticky-top">
        <div className="container">
          <a className="navbar-brand fw-bold text-primary" href="#">
            AI FINANCIAL ASSISTANT
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link" href="#home">
                  Home
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#features">
                  Features
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#about">
                  About
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#contact">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        id="home"
        className="text-center py-5 position-relative"
        style={{
          background: "linear-gradient(to bottom right, #002147, #0B294B)",
          color: "#fff",
        }}
      >
        <div className="container" data-aos="fade-up">
          <h1 className="display-3 fw-bold mb-4">
            Smarter Investing. Simplified Decisions.
          </h1>
          <p className="lead mb-4">
            Our AI-powered Financial Assistant helps you understand markets,
            manage portfolios, and make confident investment decisions — all in
            one intuitive platform.
          </p>
          <div className="d-flex justify-content-center gap-3">
            {/* ✅ Redirect to /register */}
            <button
              className="btn btn-info btn-lg fw-bold text-white"
              onClick={() => navigate("/register")}
            >
              Get Started
            </button>
            <button
              className="btn btn-outline-light btn-lg fw-bold"
              onClick={() => navigate("/contact")}
            >
              Request Demo
            </button>
          </div>
        </div>
        <svg
          className="position-absolute bottom-0 w-100"
          viewBox="0 0 1440 120"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path fill="#f8f9fa" d="M0,96L1440,0L1440,320L0,320Z" />
        </svg>
      </section>

      {/* Features Section */}
      <section id="features" className="py-5 bg-light text-dark">
        <div className="container">
          <h2 className="text-center text-primary mb-5" data-aos="fade-up">
            Core Features
          </h2>
          <div className="row g-4">
            <div
              className="col-md-6 col-lg-3"
              data-aos="zoom-in"
              data-aos-delay="100"
            >
              <div className="card text-center h-100 p-4 border-0 shadow-sm rounded-4">
                <FaMoneyBillWave className="fs-1 text-primary mb-3 mx-auto" />
                <h5 className="fw-bold">Simplified Investing</h5>
                <p className="small">
                  Understand stocks, trading, and finance concepts without
                  needing prior experience.
                </p>
              </div>
            </div>
            <div
              className="col-md-6 col-lg-3"
              data-aos="zoom-in"
              data-aos-delay="200"
            >
              <div className="card text-center h-100 p-4 border-0 shadow-sm rounded-4">
                <FaBrain className="fs-1 text-primary mb-3 mx-auto" />
                <h5 className="fw-bold">AI-Powered Advisor</h5>
                <p className="small">
                  Get real-time insights and recommendations to buy, sell, or
                  hold based on market behavior.
                </p>
              </div>
            </div>
            <div
              className="col-md-6 col-lg-3"
              data-aos="zoom-in"
              data-aos-delay="300"
            >
              <div className="card text-center h-100 p-4 border-0 shadow-sm rounded-4">
                <FaChartLine className="fs-1 text-primary mb-3 mx-auto" />
                <h5 className="fw-bold">Portfolio Dashboard</h5>
                <p className="small">
                  Visualize your portfolio performance and track financial
                  growth with clear, dynamic charts.
                </p>
              </div>
            </div>
            <div
              className="col-md-6 col-lg-3"
              data-aos="zoom-in"
              data-aos-delay="400"
            >
              <div className="card text-center h-100 p-4 border-0 shadow-sm rounded-4">
                <FaHandsHelping className="fs-1 text-primary mb-3 mx-auto" />
                <h5 className="fw-bold">Guided Learning</h5>
                <p className="small">
                  Learn investment strategies step-by-step through intuitive
                  visualizations and explanations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Image Section above About */}
      <section
        className="py-5"
        style={{ backgroundColor: "#002147", color: "#fff" }}
      >
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6 mb-4 mb-md-0" data-aos="fade-right">
              <h3 className="fw-bold mb-3">Why Choose Us?</h3>
              <p className="text-light">
                Our intelligent portfolio manager makes financial planning
                accessible to everyone, offering AI-driven recommendations and
                simplified analytics to help you make confident investment
                choices.
              </p>
              <button className="btn btn-outline-light rounded-pill px-4 mt-3">
                Learn More
              </button>
            </div>
            <div
              className="col-md-6 d-flex justify-content-center"
              data-aos="fade-left"
            >
              <div
                className="rounded-circle overflow-hidden"
                style={{
                  width: "300px",
                  height: "300px",
                  border: "6px solid white",
                }}
              >
                <img
                  src={image01}
                  alt="Financial Assistant Overview"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="bg-white py-5 text-center">
        <div className="container" data-aos="fade-up">
          <h3 className="fw-bold text-primary mb-4">
            What is the AI Financial Assistant?
          </h3>
          <p className="lead text-muted">
            A smart investment companion that simplifies the complexities of
            stock trading and portfolio management. Our platform helps users
            make informed financial decisions through AI-driven analysis,
            recommendations, and educational tools.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white pt-5 pb-4 mt-auto">
        <div className="container">
          <div className="row text-center text-md-start">
            <div className="col-md-3 mb-4">
              <h6 className="text-uppercase fw-bold">Services</h6>
              <ul className="list-unstyled small">
                <li>Portfolio Tracking</li>
                <li>AI Recommendations</li>
                <li>Financial Education</li>
                <li>Market Insights</li>
              </ul>
            </div>
            <div className="col-md-3 mb-4">
              <h6 className="text-uppercase fw-bold">Resources</h6>
              <ul className="list-unstyled small">
                <li>Documentation</li>
                <li>Investment Guides</li>
                <li>API Reference</li>
                <li>Learning Center</li>
              </ul>
            </div>
            <div className="col-md-3 mb-4">
              <h6 className="text-uppercase fw-bold">Company</h6>
              <ul className="list-unstyled small">
                <li>About</li>
                <li>Contact</li>
                <li>Careers</li>
                <li>Partners</li>
              </ul>
            </div>
            <div className="col-md-3 text-center">
              <h6 className="text-uppercase fw-bold">Follow Us</h6>
              <div className="d-flex justify-content-center gap-3 fs-5">
                <FaYoutube />
                <FaTwitter />
                <FaLinkedin />
                <FaFacebook />
                <FaInstagram />
              </div>
            </div>
          </div>
          <hr className="border-light" />
          <p className="text-center small">
            &copy; 2025 AI Financial Assistant. All rights reserved. Empowering
            smarter investing for everyone.
          </p>
        </div>
      </footer>
    </div>
  );
}
