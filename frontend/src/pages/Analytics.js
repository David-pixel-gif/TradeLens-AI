import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Card,
  Spinner,
  Table,
  Alert,
  Badge,
} from "react-bootstrap";
import {
  FaChartPie,
  FaChartLine,
  FaLightbulb,
  FaChartBar,
} from "react-icons/fa";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

export default function Analytics() {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState(null);

  const BASE_URL = "http://localhost:5000/api";

  // ==========================================================
  // 🔹 Fetch Analytics from Backend
  // ==========================================================
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/analytics`);
        if (res.data && res.data.status === "success") {
          setAnalytics(res.data.data);
        } else {
          throw new Error("Unexpected backend response format");
        }
      } catch (err) {
        console.error("Error fetching analytics:", err);
        setError(
          "❌ Unable to fetch analytics data. Please check backend connection."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  // ==========================================================
  // 🌀 Loading State
  // ==========================================================
  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "80vh", backgroundColor: "#f4f6f9" }}
      >
        <Spinner animation="border" variant="primary" />
        <span className="ms-3 text-primary fw-bold">Loading Analytics...</span>
      </div>
    );
  }

  // ==========================================================
  // ⚠️ Error State
  // ==========================================================
  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger" className="text-center fw-bold shadow-sm">
          {error}
        </Alert>
      </Container>
    );
  }

  // ==========================================================
  // ⚠️ Empty State
  // ==========================================================
  if (!analytics) {
    return (
      <Container className="py-5 text-center">
        <Alert variant="warning" className="shadow-sm">
          ⚠️ No analytics data available yet.
        </Alert>
      </Container>
    );
  }

  // ==========================================================
  // 📊 Data Preparation
  // ==========================================================
  const performanceData = analytics.performance_over_time || [];
  const allocationData = analytics.asset_allocation || [];
  const aiInsights = analytics.ai_insights || [];
  const assetDetails = analytics.asset_details || [];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A569BD"];

  // ==========================================================
  // 💡 Render
  // ==========================================================
  return (
    <div style={{ backgroundColor: "#f4f6f9", minHeight: "100vh" }}>
      <Container className="py-5">
        {/* ===== Header ===== */}
        <div className="text-center mb-5">
          <h2 className="fw-bold text-primary">
            <FaChartBar className="me-2" />
            Portfolio Analytics Dashboard
          </h2>
          <p className="text-muted mb-0">
            Visual breakdown of your investments, risk, and AI-driven insights.
          </p>
        </div>

        {/* ===== Summary Cards ===== */}
        <Row className="mb-4 g-4">
          <Col md={4}>
            <Card className="shadow-sm border-0 h-100">
              <Card.Body className="text-center">
                <h6 className="fw-semibold text-secondary">
                  Total Portfolio Value
                </h6>
                <h3 className="text-success fw-bold mt-2">
                  ${analytics.total_value?.toLocaleString() || 0}
                </h3>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="shadow-sm border-0 h-100">
              <Card.Body className="text-center">
                <h6 className="fw-semibold text-secondary">
                  Average Daily Return
                </h6>
                <h3
                  className={`fw-bold mt-2 ${
                    analytics.avg_daily_return > 0
                      ? "text-success"
                      : "text-danger"
                  }`}
                >
                  {analytics.avg_daily_return
                    ? `${analytics.avg_daily_return.toFixed(2)}%`
                    : "N/A"}
                </h3>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="shadow-sm border-0 h-100">
              <Card.Body className="text-center">
                <h6 className="fw-semibold text-secondary">
                  Volatility (Risk)
                </h6>
                <h3 className="text-warning fw-bold mt-2">
                  {analytics.volatility
                    ? `${analytics.volatility.toFixed(2)}%`
                    : "N/A"}
                </h3>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* ===== Performance Line Chart ===== */}
        <Card className="shadow-sm border-0 mb-4">
          <Card.Body>
            <h5 className="fw-bold text-primary mb-3">
              <FaChartLine className="me-2" />
              Portfolio Performance Over Time
            </h5>
            {performanceData.length > 0 ? (
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#007bff"
                    strokeWidth={2}
                    dot={false}
                    animationDuration={1200}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-muted text-center mb-0">
                No performance data available.
              </p>
            )}
          </Card.Body>
        </Card>

        {/* ===== Pie Chart: Asset Allocation ===== */}
        <Card className="shadow-sm border-0 mb-4">
          <Card.Body>
            <h5 className="fw-bold text-primary mb-3">
              <FaChartPie className="me-2" />
              Asset Allocation
            </h5>
            {allocationData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={allocationData}
                    dataKey="percentage"
                    nameKey="asset"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                    animationDuration={1000}
                  >
                    {allocationData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-muted text-center mb-0">
                No allocation data available.
              </p>
            )}
          </Card.Body>
        </Card>

        {/* ===== AI Insights ===== */}
        <Card className="shadow-sm border-0 mb-4">
          <Card.Body>
            <h5 className="fw-bold text-primary mb-3">
              <FaLightbulb className="me-2 text-warning" />
              AI-Generated Investment Insights
            </h5>
            {aiInsights.length > 0 ? (
              <ul className="list-unstyled">
                {aiInsights.map((tip, i) => (
                  <li key={i} className="mb-2 text-muted">
                    💡 {tip}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted mb-0">No AI insights generated yet.</p>
            )}
          </Card.Body>
        </Card>

        {/* ===== Asset Details Table ===== */}
        <Card className="shadow-sm border-0">
          <Card.Body>
            <h5 className="fw-bold text-primary mb-3">
              Asset Performance Breakdown
            </h5>
            {assetDetails.length > 0 ? (
              <div className="table-responsive">
                <Table bordered hover className="align-middle shadow-sm">
                  <thead className="table-dark">
                    <tr>
                      <th>Symbol</th>
                      <th>Current Price</th>
                      <th>Change (%)</th>
                      <th>Recommendation</th>
                      <th>Volatility</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assetDetails.map((a, idx) => (
                      <tr key={idx}>
                        <td>{a.symbol}</td>
                        <td>${a.current_price?.toFixed(2)}</td>
                        <td
                          className={
                            a.change_pct > 0 ? "text-success" : "text-danger"
                          }
                        >
                          {a.change_pct.toFixed(2)}%
                        </td>
                        <td>
                          <Badge
                            bg={
                              a.recommendation === "Buy"
                                ? "success"
                                : a.recommendation === "Sell"
                                ? "danger"
                                : "warning"
                            }
                          >
                            {a.recommendation}
                          </Badge>
                        </td>
                        <td>{a.volatility?.toFixed(2)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            ) : (
              <p className="text-muted text-center mb-0">
                No asset details available.
              </p>
            )}
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}
