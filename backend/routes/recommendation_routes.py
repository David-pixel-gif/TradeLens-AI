from datetime import datetime, timedelta
from flask import Blueprint, jsonify, request
from utils.polygon_client import fetch_stock_data
from utils.trade_analysis import analyze_stock  # ✅ fixed import name

recommendation_bp = Blueprint("recommendation_bp", __name__)

@recommendation_bp.route("/api/recommendation", methods=["GET"])
def recommend_stock():
    """
    Fetches stock data for the requested ticker and performs analysis
    using the `analyze_stock()` function.
    """
    try:
        # === Parameters ===
        ticker = request.args.get("ticker", "AAPL").upper()
        start_date = request.args.get("from", "2024-01-01")
        end_date = request.args.get("to", datetime.today().strftime("%Y-%m-%d"))

        # === Extend range for more context ===
        start_dt = datetime.strptime(start_date, "%Y-%m-%d") - timedelta(days=15)
        start_date_extended = start_dt.strftime("%Y-%m-%d")

        # === Fetch Stock Data ===
        df = fetch_stock_data(ticker, start_date_extended, end_date)
        if df is None or df.empty:
            return jsonify({
                "status": "error",
                "message": f"No data returned for ticker {ticker}. Check your API key or symbol."
            }), 404

        # === Analyze Trend (✅ FIXED FUNCTION CALL) ===
        result = analyze_stock(df)

        # === Return Response ===
        return jsonify({
            "status": "success",
            "ticker": ticker,
            "from": start_date,
            "to": end_date,
            "analysis": result
        }), 200

    except Exception as e:
        print(f"❌ Error in /api/recommendation: {e}")
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500
