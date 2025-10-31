# routes/polygon_routes.py
from flask import Blueprint, jsonify, request
from utils.polygon_client import fetch_stock_data

polygon_bp = Blueprint("polygon_bp", __name__)

@polygon_bp.route("/api/polygon_data", methods=["GET"])
def get_polygon_data():
    ticker = request.args.get("ticker", "AAPL")
    start_date = request.args.get("from", "2024-01-01")
    end_date = request.args.get("to", "2024-01-10")
    timespan = request.args.get("timespan", "day")

    try:
        df = fetch_stock_data(ticker, start_date, end_date, timespan)
        return jsonify(df.to_dict(orient="records"))
    except Exception as e:
        return jsonify({"error": str(e)}), 500
