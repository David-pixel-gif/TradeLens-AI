import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Modal,
  Badge,
} from "react-bootstrap";
import {
  FaChartLine,
  FaUpload,
  FaSearchDollar,
  FaBalanceScale,
  FaShieldAlt,
  FaArrowRight,
} from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

export default function ServicesPage() {
  const [showModal, setShowModal] = useState(false);
  const [marketUpdates, setMarketUpdates] = useState(0);

  // Simulated live market updates (for visual effect)
  useEffect(() => {
    const interval = setInterval(() => {
      setMarketUpdates((prev) => prev + Math.floor(Math.random() * 5));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const handleModal = () => setShowModal(!showModal);

  return (
    <div className="bg-light text-dark py-5" id="services">
      <Container>
        <h1 className="text-center text-primary fw-bold mb-5 display-4">
          Financial Assistant Services & Capabilities
        </h1>

        {/* Live Market Updates */}
        <div className="text-center mb-5">
          <h5>
            📈 <Badge bg="success">Live Market Updates</Badge>:{" "}
            <span className="fw-bold text-success">{marketUpdates}</span>
          </h5>
          <p className="small text-muted">
            Real-time simulated insights and updates from your connected
            portfolio.
          </p>
        </div>

        <Row className="g-4 justify-content-center">
          {/* Portfolio Dashboard */}
          <Col md={4}>
            <Card className="text-white bg-dark text-center shadow h-100">
              <Card.Body>
                <FaChartLine size={40} className="mb-3 text-warning" />
                <Card.Title>Portfolio Dashboard</Card.Title>
                <Card.Text>
                  Monitor performance, diversification, and asset allocation in
                  one interactive view.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          {/* Data Upload */}
          <Col md={4}>
            <Card className="text-white bg-dark text-center shadow h-100">
              <Card.Body>
                <FaUpload size={40} className="mb-3 text-info" />
                <Card.Title>Data Upload & Analysis</Card.Title>
                <Card.Text>
                  Upload historical trades or portfolio data to generate
                  detailed analytics and future projections.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          {/* AI Recommendations */}
          <Col md={4}>
            <Card className="text-white bg-dark text-center shadow h-100">
              <Card.Body>
                <FaSearchDollar size={40} className="mb-3 text-success" />
                <Card.Title>AI Recommendations</Card.Title>
                <Card.Text>
                  Receive smart buy, sell, or hold recommendations based on
                  current market conditions and AI-driven forecasts.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          {/* Risk & Balance Insights */}
          <Col md={4}>
            <Card className="text-white bg-dark text-center shadow h-100">
              <Card.Body>
                <FaBalanceScale size={40} className="mb-3 text-primary" />
                <Card.Title>Risk & Balance Insights</Card.Title>
                <Card.Text>
                  Identify risk levels, portfolio imbalances, or overexposure
                  trends for better diversification.
                  <br />
                  <Button
                    size="sm"
                    variant="light"
                    className="mt-2"
                    onClick={handleModal}
                  >
                    View Examples
                  </Button>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          {/* Security & Data Protection */}
          <Col md={4}>
            <Card className="text-white bg-dark text-center shadow h-100">
              <Card.Body>
                <FaShieldAlt size={40} className="mb-3 text-danger" />
                <Card.Title>Data Security & Compliance</Card.Title>
                <Card.Text>
                  Your financial data is protected with advanced encryption and
                  compliance with global privacy standards.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Partners or Integrations */}
        <section className="my-5 text-center" id="partners">
          <h4 className="text-secondary fw-bold mb-3">
            Integrated with Trusted Financial Platforms
          </h4>
          <p className="text-muted small">
            FinWise AI • MarketView360 • SmartPortfolio Cloud • SecureTrade Hub
          </p>
        </section>

        {/* Call-to-Action */}
        <div className="text-center mt-5">
          <Button
            variant="primary"
            size="lg"
            className="rounded-pill px-5 fw-bold"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            Start Managing Today <FaArrowRight className="ms-2" />
          </Button>
        </div>

        {/* Modal for Examples */}
        <Modal show={showModal} onHide={handleModal}>
          <Modal.Header closeButton>
            <Modal.Title>Example Portfolio Insights</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ul>
              <li>
                Your portfolio has 65% exposure in tech — consider adding
                healthcare or energy for balance.
              </li>
              <li>
                AI detected underperforming stocks based on recent market
                volatility.
              </li>
              <li>
                Recommended rebalancing: Shift 10% of assets to stable ETFs for
                reduced long-term risk.
              </li>
            </ul>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
}
