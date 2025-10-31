import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Spinner,
  Alert,
  Button,
} from "react-bootstrap";
import axios from "axios";
import { FaNewspaper, FaLightbulb } from "react-icons/fa";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [aiSummary, setAiSummary] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const BASE_URL = "http://localhost:5000/api/notifications";

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(BASE_URL);
        setNotifications(response.data.news || []);
        setAiSummary(response.data.ai_summary || "");
      } catch (err) {
        console.error("Error fetching notifications:", err);
        setError("Failed to fetch news updates. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center vh-100 bg-light"
        style={{ flexDirection: "column" }}
      >
        <Spinner animation="border" variant="primary" />
        <p className="mt-3 fw-bold text-primary">Fetching market updates...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger" className="text-center">
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <div className="text-center mb-5">
        <h2 className="fw-bold text-primary">
          <FaNewspaper className="me-2" />
          Market News & AI Insights
        </h2>
        <p className="text-muted">
          Stay informed with real-time financial updates and AI-generated
          trading ideas.
        </p>
      </div>

      {/* 🧠 AI Summary Section */}
      {aiSummary && (
        <Card className="mb-4 shadow-sm border-0">
          <Card.Body>
            <h5 className="fw-bold text-success">
              <FaLightbulb className="me-2" />
              AI Trading Insights
            </h5>
            <p className="text-muted">{aiSummary}</p>
          </Card.Body>
        </Card>
      )}

      {/* 📰 News Section */}
      <Row className="g-4">
        {notifications.map((article, index) => (
          <Col md={6} lg={4} key={index}>
            <Card className="shadow-sm border-0 h-100">
              {article.urlToImage && (
                <Card.Img
                  variant="top"
                  src={article.urlToImage}
                  alt="news thumbnail"
                  style={{ height: "180px", objectFit: "cover" }}
                />
              )}
              <Card.Body>
                <Card.Title className="fw-semibold">{article.title}</Card.Title>
                <Card.Text className="text-muted small">
                  {article.description
                    ? article.description.slice(0, 120) + "..."
                    : "No description available."}
                </Card.Text>
                <Button
                  variant="outline-primary"
                  size="sm"
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Read Full Article →
                </Button>
              </Card.Body>
              <Card.Footer className="bg-light text-muted small">
                Source: {article.source?.name || "Unknown"}
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
