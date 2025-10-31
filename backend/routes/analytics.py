from flask import Blueprint, jsonify
import random
import datetime
import os
import openai  # ✅ Make sure you have: pip install openai
from dotenv import load_dotenv

# ==========================================================
# 🔹 Load environment variables
# ==========================================================
load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

# ==========================================================
# 🔹 Blueprint Setup
# ==========================================================
analytics_bp = Blueprint("analytics_bp", __name__, url_prefix="/api/analytics")


# ==========================================================
# 🧠 AI Insights Generator
# ==========================================================
def generate_ai_insights(portfolio_summary):
    """
    Use OpenAI to generate 4–5 human-readable investment insights.
    Fallbacks are used if API key is not configured or an error occurs.
    """
    if not openai.api_key:
        print("⚠️ OpenAI key not found — using fallback AI insights.")
        return [
            "AAPL continues to demonstrate steady long-term growth potential.",
            "TSLA volatility remains high — suitable for short-term trading opportunities.",
            "AMZN remains strong in e-commerce and cloud sectors.",
            "Diversifying into GOOGL or ETFs could help reduce overall portfolio risk.",
        ]

    try:
        prompt = (
            "You are an experienced financial analyst. Based on this portfolio summary, "
            "generate 4–5 concise, professional investment insights:\n\n"
            f"{portfolio_summary}\n\n"
            "Keep responses short, in plain English, and focused on actionable insights."
        )

        response = openai.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a professional investment advisor."},
                {"role": "user", "content": prompt},
            ],
            max_tokens=200,
            temperature=0.7,
        )

        text = response.choices[0].message.content.strip()
        insights = [line.strip("12345.- ") for line in text.split("\n") if line.strip()]
        return insights

    except Exception as e:
        print(f"⚠️ AI insights generation failed: {e}")
        return [
            "Unable to fetch AI-generated insights at this time.",
            "Tech-heavy portfolios should monitor volatility closely.",
            "AMZN remains stable; consider rebalancing around high-risk assets.",
        ]


# ==========================================================
# 📊 Route: GET /api/analytics
# ==========================================================
@analytics_bp.route("", methods=["GET"])
def get_analytics():
    """
    Provides simulated analytics data for the dashboard.
    This route structure is 100% compatible with your Analytics.js frontend.
    """
    try:
        # --- Generate simulated time-series performance data ---
        today = datetime.date.today()
        performance = [
            {
                "date": (today - datetime.timedelta(days=i)).strftime("%Y-%m-%d"),
                "value": round(40000 + random.uniform(-2500, 3000) + i * 35, 2),
            }
            for i in range(15)
        ]
        performance.reverse()

        # --- Portfolio asset allocation breakdown ---
        allocation = [
            {"asset": "AAPL", "percentage": 35},
            {"asset": "TSLA", "percentage": 25},
            {"asset": "AMZN", "percentage": 20},
            {"asset": "GOOGL", "percentage": 20},
        ]

        # --- Asset performance details ---
        asset_details = [
            {"symbol": "AAPL", "current_price": 192.4, "change_pct": 2.45, "recommendation": "Hold", "volatility": 5.23},
            {"symbol": "TSLA", "current_price": 245.1, "change_pct": -1.12, "recommendation": "Buy", "volatility": 6.88},
            {"symbol": "AMZN", "current_price": 151.3, "change_pct": 1.88, "recommendation": "Sell", "volatility": 6.12},
            {"symbol": "GOOGL", "current_price": 139.7, "change_pct": 0.75, "recommendation": "Hold", "volatility": 4.95},
        ]

        # --- Aggregate metrics ---
        total_value = round(sum(a["current_price"] * random.randint(5, 15) for a in asset_details), 2)
        avg_daily_return = round(random.uniform(-1.5, 2.5), 2)
        volatility = round(random.uniform(4.0, 8.5), 2)

        # --- Generate AI-based insights ---
        portfolio_summary = {
            "total_value": total_value,
            "avg_daily_return": avg_daily_return,
            "volatility": volatility,
            "assets": [a["symbol"] for a in asset_details],
        }
        ai_insights = generate_ai_insights(portfolio_summary)

        # --- Combine all analytics data ---
        analytics_data = {
            "total_value": total_value,
            "avg_daily_return": avg_daily_return,
            "volatility": volatility,
            "performance_over_time": performance,
            "asset_allocation": allocation,
            "ai_insights": ai_insights,
            "asset_details": asset_details,
        }

        # ✅ Structure matches frontend expectations
        response = {"status": "success", "data": analytics_data}

        # Print to verify what frontend sees
        print("\n✅ /api/analytics Response Structure:")
        print(response)

        return jsonify(response), 200

    except Exception as e:
        print(f"❌ Error generating analytics: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500
