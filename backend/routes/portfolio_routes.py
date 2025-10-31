from flask import Blueprint, request, jsonify
import pandas as pd
import yfinance as yf
import os
from openai import OpenAI

# ==========================================================
# 🔹 Blueprint Setup
# ==========================================================
portfolio_bp = Blueprint("portfolio_bp", __name__, url_prefix="/api/portfolio")

# ==========================================================
# 🧠 Initialize OpenAI Client
# ==========================================================
# Make sure your .env or environment contains: OPENAI_API_KEY=sk-xxxxxxx
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=OPENAI_API_KEY) if OPENAI_API_KEY else None


# ==========================================================
# ⚙️ Simple Heuristic Fallback
# ==========================================================
def basic_recommendation(current_price, avg_price):
    """Fallback Buy/Sell/Hold logic."""
    try:
        change = ((current_price - avg_price) / avg_price) * 100
        if change > 8:
            return "Sell", "📈 Price rose over 8%, consider taking profit."
        elif change < -5:
            return "Buy", "📉 Price dropped over 5%, may be undervalued."
        else:
            return "Hold", "⚖️ Price is stable — maintain your position."
    except Exception:
        return "N/A", "⚠️ Unable to calculate recommendation."


# ==========================================================
# 📊 Route: GET /api/portfolio
# ==========================================================
@portfolio_bp.route("", methods=["GET"])
def get_portfolio():
    """Return sample portfolio data for testing."""
    sample_portfolio = {
        "user_id": 1,
        "total_value": 45250.75,
        "assets": [
            {"symbol": "AAPL", "shares": 10, "value": 1920.50},
            {"symbol": "TSLA", "shares": 8, "value": 1985.30},
            {"symbol": "AMZN", "shares": 5, "value": 1510.10},
        ],
    }
    return jsonify({
        "status": "success",
        "message": "Portfolio data retrieved successfully.",
        "data": sample_portfolio
    }), 200


# ==========================================================
# 📈 Route: POST /api/portfolio/analyze
# ==========================================================
@portfolio_bp.route("/analyze", methods=["POST"])
def analyze_portfolio():
    """
    Accepts a CSV/XLSX upload, fetches live stock prices,
    generates AI-based portfolio insights, and returns recommendations.
    """
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded."}), 400

    file = request.files["file"]
    filename = file.filename.lower()

    try:
        # --- Read uploaded file ---
        if filename.endswith(".csv"):
            df = pd.read_csv(file)
        elif filename.endswith(".xlsx"):
            df = pd.read_excel(file)
        else:
            return jsonify({"error": "Unsupported file type. Use CSV or XLSX."}), 400

        # --- Validate Columns ---
        required_columns = {"Symbol", "BuyPrice"}
        if not required_columns.issubset(df.columns):
            return jsonify({
                "error": f"Missing required columns: {required_columns - set(df.columns)}"
            }), 400

        results, ai_prompts = [], []

        # ======================================================
        # 🔄 Process Each Stock
        # ======================================================
        for _, row in df.iterrows():
            symbol = str(row["Symbol"]).strip().upper()
            buy_price = float(row["BuyPrice"])
            quantity = int(row.get("Quantity", 1))

            try:
                ticker = yf.Ticker(symbol)
                hist = ticker.history(period="1d")

                if hist.empty:
                    raise ValueError("No live market data found for this symbol.")

                current_price = round(hist["Close"].iloc[-1], 2)
                change_pct = round(((current_price - buy_price) / buy_price) * 100, 2)

                # Basic fallback recommendation
                recommendation, explanation = basic_recommendation(current_price, buy_price)

                result = {
                    "Symbol": symbol,
                    "BuyPrice": buy_price,
                    "CurrentPrice": current_price,
                    "Change (%)": change_pct,
                    "Recommendation": recommendation,
                    "Explanation": explanation,
                    "Quantity": quantity,
                    "TotalValue": round(current_price * quantity, 2)
                }
                results.append(result)

                ai_prompts.append(
                    f"{symbol}: Bought at ${buy_price}, now ${current_price} ({change_pct}%). "
                    f"Recommendation: {recommendation}."
                )

            except Exception as fetch_err:
                results.append({
                    "Symbol": symbol,
                    "BuyPrice": buy_price,
                    "CurrentPrice": "N/A",
                    "Change (%)": "N/A",
                    "Recommendation": "Data Unavailable",
                    "Explanation": f"⚠️ Could not fetch data: {str(fetch_err)}"
                })

        # ======================================================
        # 💰 Total Portfolio Value
        # ======================================================
        total_value = sum(
            item["TotalValue"] for item in results
            if isinstance(item.get("TotalValue"), (int, float))
        )

        # ======================================================
        # 🧠 Generate Portfolio Insights via OpenAI
        # ======================================================
        ai_summary = "AI analysis unavailable."
        if client:
            try:
                prompt = (
                    "You are a professional financial advisor AI. "
                    "Analyze the following portfolio data, detect potential risks, "
                    "highlight overperformers/underperformers, and offer strategic advice. "
                    "Be concise, clear, and actionable.\n\n"
                    + "\n".join(ai_prompts) +
                    "\n\nProvide a 3-4 sentence summary."
                )

                completion = client.chat.completions.create(
                    model="gpt-4o-mini",
                    messages=[
                        {"role": "system", "content": "You are an expert financial analyst."},
                        {"role": "user", "content": prompt},
                    ],
                    max_tokens=250,
                    temperature=0.7,
                )
                ai_summary = completion.choices[0].message.content.strip()

            except Exception as e:
                ai_summary = f"⚠️ AI summary unavailable due to: {str(e)}"

        # ======================================================
        # 📦 Final Response
        # ======================================================
        return jsonify({
            "status": "success",
            "summary": {
                "total_symbols": len(results),
                "total_value": round(total_value, 2),
                "ai_summary": ai_summary
            },
            "portfolio": results
        }), 200

    except Exception as e:
        print(f"❌ Error analyzing portfolio: {e}")
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500
