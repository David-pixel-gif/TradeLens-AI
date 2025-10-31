import os
import time
import logging
import datetime
from flask import Flask, request, g, jsonify
from flask_cors import CORS
from flask_migrate import Migrate
from config import Config
from models import db

# ==========================================================
# 🔹 Import Blueprints
# ==========================================================
from routes.analytics import analytics_bp
from routes.authentication import authentication_bp
from routes.polygon_routes import polygon_bp
from routes.recommendation_routes import recommendation_bp
from routes.portfolio_routes import portfolio_bp
from routes.ai_analysis import ai_analysis_bp
from routes.notifications import notifications_bp


# ==========================================================
# 🧱 Flask App Setup
# ==========================================================
app = Flask(__name__)
app.config.from_object(Config)

# ✅ Enable CORS (fixed to allow frontend React app)
CORS(
    app,
    resources={r"/api/*": {"origins": ["http://localhost:3000"]}},
    supports_credentials=True,
    allow_headers=["Content-Type", "Authorization"],
    methods=["GET", "POST", "OPTIONS", "PUT", "DELETE"],
)

# ✅ Initialize Database and Migration
db.init_app(app)
migrate = Migrate(app, db)

# Auto-create tables (dev only)
with app.app_context():
    db.create_all()


# ==========================================================
# 🎨 Logging Setup (Colorized + File)
# ==========================================================
LOG_DIR = "logs"
os.makedirs(LOG_DIR, exist_ok=True)
log_file = os.path.join(LOG_DIR, "app.log")

COLORS = {
    "INFO": "\033[92m",
    "WARNING": "\033[93m",
    "ERROR": "\033[91m",
    "RESET": "\033[0m",
    "BOLD": "\033[1m",
}

class ColorFormatter(logging.Formatter):
    """Add color-coded log output for better readability."""
    def format(self, record):
        color = COLORS.get(record.levelname, COLORS["RESET"])
        reset = COLORS["RESET"]
        record.msg = f"{color}{COLORS['BOLD']}{record.levelname:<8}{reset} {record.msg}"
        return super().format(record)

formatter = logging.Formatter("%(asctime)s | %(message)s", "%Y-%m-%d %H:%M:%S")

file_handler = logging.FileHandler(log_file, encoding="utf-8")
file_handler.setFormatter(formatter)

console_handler = logging.StreamHandler()
console_handler.setFormatter(ColorFormatter("%(asctime)s | %(message)s", "%H:%M:%S"))

logger = logging.getLogger()
logger.setLevel(logging.INFO)
logger.addHandler(file_handler)
logger.addHandler(console_handler)


# ==========================================================
# 🧭 Log Each Request (Middleware + Timing)
# ==========================================================
@app.before_request
def log_request_info():
    g.start_time = time.time()
    ts = datetime.datetime.now().strftime("%H:%M:%S")
    logger.info(f"➡️  [{ts}] {request.method} {request.path}")

@app.after_request
def log_response_info(response):
    duration = (time.time() - g.start_time) * 1000
    ts = datetime.datetime.now().strftime("%H:%M:%S")
    logger.info(
        f"⬅️  [{ts}] {response.status_code} for {request.method} "
        f"{request.path} ({duration:.2f} ms)"
    )
    return response


# ==========================================================
# 🔗 Register Blueprints
# ==========================================================
app.register_blueprint(analytics_bp)
app.register_blueprint(authentication_bp)
app.register_blueprint(polygon_bp)
app.register_blueprint(recommendation_bp)
app.register_blueprint(portfolio_bp)
app.register_blueprint(ai_analysis_bp)
app.register_blueprint(notifications_bp)


# ==========================================================
# 📋 Route Listing Utility
# ==========================================================
def print_registered_routes(app):
    """Print all registered routes neatly — works across all Flask versions."""
    border = "═" * 80
    print(f"\n📍 {COLORS['BOLD']}Registered Flask Routes{COLORS['RESET']}")
    print(border)
    all_rules = list(app.url_map.iter_rules())
    for rule in sorted(all_rules, key=lambda r: r.rule):
        methods = ",".join(sorted(rule.methods))
        print(f"{rule.rule:<60s} → {methods}")
    print(border)
    print(f"🧭 Total Routes Registered: {len(all_rules)}\n")


# Print once at startup
print_registered_routes(app)


# ==========================================================
# 🩺 Root Health Endpoint
# ==========================================================
@app.route("/", methods=["GET"])
def index():
    """Simple health check."""
    return {
        "status": "running",
        "message": "💡 Finance IO Backend API is live and ready!",
        "timestamp": datetime.datetime.utcnow().isoformat(),
        "endpoints": [
            "/api/portfolio",
            "/api/portfolio/analyze",
            "/api/recommendation",
            "/api/polygon",
            "/api/auth/me"
        ],
    }, 200


# ==========================================================
# 🧍 Temporary Auth Route for /api/auth/me (if missing)
# ==========================================================
@app.route("/api/auth/me", methods=["GET", "OPTIONS"])
def mock_user():
    """
    Temporary fallback to avoid frontend 404.
    Replace with your JWT-based authentication route later.
    """
    if request.method == "OPTIONS":
        return jsonify({"message": "CORS preflight OK"}), 200
    return jsonify({
        "status": "success",
        "user": {
            "id": 1,
            "name": "Nigel",
            "email": "nigel@example.com"
        }
    }), 200


# ==========================================================
# 🚀 Entry Point
# ==========================================================
if __name__ == "__main__":
    logger.info("✅ Finance IO Backend started successfully!")
    logger.info("🌐 Running at: http://0.0.0.0:5000")
    logger.info(f"🪵 Logs are being written to: {log_file}")
    print_registered_routes(app)
    app.run(debug=True, host="0.0.0.0", port=5000)
