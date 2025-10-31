import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  Button,
  Container,
  Form,
  Spinner,
  Alert,
  Row,
  Col,
  Card,
  Badge,
} from "react-bootstrap";
import {
  FaUpload,
  FaChartLine,
  FaTrash,
  FaEnvelope,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

export default function Dashboard() {
  // ====== State Variables ======
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]); // analyzed results
  const [portfolio, setPortfolio] = useState([]); // existing/sample portfolio
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [description, setDescription] = useState("");
  const [apiStatus, setApiStatus] = useState(false);
  const [totals, setTotals] = useState({ total: 0, buy: 0, sell: 0, hold: 0 });
  const [aiSummary, setAiSummary] = useState("");
  const [uploadedPreview, setUploadedPreview] = useState([]);

  // ✅ Base backend URL
  const BASE_URL = "http://localhost:5000/api";

  // ====== Check API Status & Fetch Portfolio ======
  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/portfolio/analyze`);
        if (res.status === 200) setApiStatus(true);
      } catch {
        setApiStatus(false);
      }
    };

    const fetchPortfolio = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/portfolio`);
        if (res.data?.data?.assets) {
          setPortfolio(res.data.data.assets);
        }
      } catch (err) {
        console.error("Portfolio fetch error:", err);
        setError("Failed to fetch portfolio data.");
      }
    };

    checkApiStatus();
    fetchPortfolio();
  }, []);

  // ====== File Upload & Preview ======
  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setSuccess(false);
    setError("");
    setData([]);
    setAiSummary("");
    setDescription("");

    if (selectedFile && selectedFile.name.endsWith(".csv")) {
      try {
        const text = await selectedFile.text();
        const rows = text.split("\n").map((r) => r.split(","));
        const headers = rows[0];
        const parsed = rows
          .slice(1)
          .filter((r) => r.some((cell) => cell.trim() !== ""))
          .map((r) => {
            let obj = {};
            headers.forEach((h, i) => (obj[h.trim()] = r[i]?.trim()));
            return obj;
          });
        setUploadedPreview(parsed);
      } catch (err) {
        console.error("Preview parse error:", err);
        setUploadedPreview([]);
      }
    } else {
      setUploadedPreview([
        { Info: "📂 Preview available for CSV files only." },
      ]);
    }
  };

  // ====== Analyze Portfolio ======
  const handleUpload = async () => {
    if (!file) {
      setError("Please upload a CSV or XLSX file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      setError("");
      setSuccess(false);
      setAiSummary("");

      const res = await axios.post(`${BASE_URL}/portfolio/analyze`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("✅ Backend Response:", res.data);

      // ---- Parse backend data safely ----
      const portfolioData = Array.isArray(res.data)
        ? res.data
        : res.data?.portfolio || [];

      const aiSummaryText =
        res.data?.summary?.ai_summary ||
        "🤖 AI summary unavailable — no insights provided.";

      setData(portfolioData);
      setAiSummary(aiSummaryText);
      setSuccess(true);
      setEmailSent(false);

      // ---- Compute summary counts ----
      const buy = portfolioData.filter(
        (d) => d.Recommendation === "Buy"
      ).length;
      const sell = portfolioData.filter(
        (d) => d.Recommendation === "Sell"
      ).length;
      const hold = portfolioData.filter(
        (d) => d.Recommendation === "Hold"
      ).length;
      setTotals({ total: portfolioData.length, buy, sell, hold });

      // ---- Determine market mood ----
      if (buy > sell && buy > hold) {
        setDescription(
          "📈 Optimistic outlook — strong upward momentum detected."
        );
      } else if (sell > buy) {
        setDescription("📉 Market looks bearish — consider reducing exposure.");
      } else {
        setDescription(
          "⚖️ Mixed outlook — holding strategy may be appropriate."
        );
      }
    } catch (err) {
      console.error("Portfolio analysis error:", err);
      setError(
        "❌ Portfolio analysis failed. Please verify your backend and file format."
      );
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  // ====== Reset Dashboard ======
  const handleReset = () => {
    setFile(null);
    setData([]);
    setSuccess(false);
    setError("");
    setEmailSent(false);
    setDescription("");
    setTotals({ total: 0, buy: 0, sell: 0, hold: 0 });
    setAiSummary("");
    setUploadedPreview([]);
  };

  // ====== Email Summary Report ======
  const handleEmail = async () => {
    try {
      const emailResponse = await axios.post(`${BASE_URL}/email-report`, {
        recipient: "investor@financeio.com",
        data,
      });
      if (emailResponse.status === 200) {
        setEmailSent(true);
        setError("");
      }
    } catch (err) {
      console.error("Email sending failed:", err);
      setError("Failed to send report email.");
    }
  };

  const confidenceScore =
    totals.total > 0
      ? (((totals.buy + totals.hold * 0.5) / totals.total) * 100).toFixed(1)
      : "N/A";

  // ====== JSX ======
  return (
    <div style={{ background: "#f4f6f9", minHeight: "100vh" }}>
      <Container className="py-5">
        {/* ====== Header ====== */}
        <div className="text-center mb-4">
          <h2 className="text-primary fw-bold">
            <FaChartLine className="me-2" />
            Finance IO – Smart Portfolio Dashboard
          </h2>
          <p className="text-muted">
            AI-driven insights for smarter investment decisions.
          </p>
          {apiStatus ? (
            <p className="text-success fw-bold">
              <FaCheckCircle className="me-2" />
              Connected to AI Analysis API
            </p>
          ) : (
            <p className="text-danger fw-bold">
              <FaTimesCircle className="me-2" />
              Unable to connect to AI Analysis API
            </p>
          )}
        </div>

        {/* ====== Upload Section ====== */}
        <Row className="mb-4">
          <Col md={4} className="mb-3">
            <Card className="shadow-sm border-0 h-100">
              <Card.Body>
                <Form.Group controlId="formFile">
                  <Form.Label className="fw-semibold">
                    Upload Portfolio File (CSV/XLSX)
                  </Form.Label>
                  <Form.Control
                    type="file"
                    accept=".csv,.xlsx"
                    onChange={handleFileChange}
                  />
                </Form.Group>

                <div className="d-flex justify-content-between gap-2 mt-3">
                  <Button
                    variant="primary"
                    onClick={handleUpload}
                    disabled={loading}
                    className="w-100 fw-bold"
                  >
                    {loading ? (
                      <>
                        <Spinner
                          animation="border"
                          size="sm"
                          className="me-2"
                        />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <FaUpload className="me-2" />
                        Analyze Portfolio
                      </>
                    )}
                  </Button>

                  <Button variant="outline-danger" onClick={handleReset}>
                    <FaTrash className="me-2" />
                    Clear
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* ====== Summary Section ====== */}
          <Col md={8}>
            <Card className="shadow-sm border-0 h-100 text-white bg-secondary">
              <Card.Body className="text-center">
                <h5>
                  Total Assets:{" "}
                  <Badge bg="light" text="dark">
                    {totals.total}
                  </Badge>
                </h5>
                <h5>
                  Buy: <Badge bg="success">{totals.buy}</Badge>
                </h5>
                <h5>
                  Hold: <Badge bg="info">{totals.hold}</Badge>
                </h5>
                <h5>
                  Sell: <Badge bg="danger">{totals.sell}</Badge>
                </h5>
                <h5>
                  Confidence Score:{" "}
                  <Badge bg="warning" text="dark">
                    {confidenceScore}%
                  </Badge>
                </h5>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* ====== Alerts ====== */}
        {error && <Alert variant="danger">❌ {error}</Alert>}
        {success && (
          <Alert variant="success">✅ Portfolio analyzed successfully!</Alert>
        )}
        {emailSent && (
          <Alert variant="info">
            📧 Report emailed to investor@financeio.com.
          </Alert>
        )}

        {/* ====== Uploaded File Preview ====== */}
        {file && uploadedPreview.length > 0 && (
          <Card className="shadow-sm border-0 mb-4">
            <Card.Header className="fw-bold bg-light">
              📂 Uploaded File Preview
            </Card.Header>
            <Card.Body className="table-responsive">
              <Table bordered hover size="sm" className="align-middle">
                <thead className="table-secondary">
                  <tr>
                    {Object.keys(uploadedPreview[0]).map((key) => (
                      <th key={key}>{key}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {uploadedPreview.map((row, idx) => (
                    <tr key={idx}>
                      {Object.values(row).map((val, i) => (
                        <td key={i}>{val}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        )}

        {/* ====== AI Insights ====== */}
        {aiSummary && (
          <Card className="shadow-sm border-0 mb-4">
            <Card.Header className="fw-bold bg-info text-white">
              🤖 AI Insights
            </Card.Header>
            <Card.Body>
              <p style={{ whiteSpace: "pre-line" }}>{aiSummary}</p>
            </Card.Body>
          </Card>
        )}

        {/* ====== Analysis Results ====== */}
        {data.length > 0 && (
          <>
            <Card className="shadow-sm border-0 mb-4">
              <Card.Header className="fw-bold bg-dark text-white">
                📊 Portfolio Analysis Results
              </Card.Header>
              <Card.Body className="table-responsive">
                <Table bordered hover className="align-middle">
                  <thead className="table-dark">
                    <tr>
                      {Object.keys(data[0]).map((key) => (
                        <th key={key} className="text-center">
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((row, idx) => (
                      <tr
                        key={idx}
                        style={{
                          backgroundColor:
                            row.Recommendation === "Buy"
                              ? "#d4edda"
                              : row.Recommendation === "Sell"
                              ? "#f8d7da"
                              : "#fff3cd",
                          color:
                            row.Recommendation === "Buy"
                              ? "#155724"
                              : row.Recommendation === "Sell"
                              ? "#721c24"
                              : "#856404",
                        }}
                      >
                        {Object.values(row).map((val, i) => (
                          <td key={i} className="text-center">
                            {val}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>

            <div className="text-center mb-5">
              <p className="fw-bold text-muted">{description}</p>
              <Button variant="outline-primary" onClick={handleEmail}>
                <FaEnvelope className="me-2" />
                Email Summary Report
              </Button>
            </div>
          </>
        )}
      </Container>
    </div>
  );
}
