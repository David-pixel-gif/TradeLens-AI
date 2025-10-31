# routes/ai_analysis.py
import os
import pandas as pd
from flask import Blueprint, request, jsonify
from dotenv import load_dotenv
from openai import OpenAI

# Load environment variables
load_dotenv()

ai_analysis_bp = Blueprint("ai_analysis_bp", __name__)

# Securely load OpenAI key
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

@ai_analysis_bp.route("/api/portfolio/analyze", methods=["GET", "POST"])
def analyze_portfolio():
    # ✅ Handle GET request (for status check)
    if request.method == "GET":
        return jsonify({"message": "✅ AI Analysis API is live."}), 200

    # ✅ Handle POST request (for file upload)
    try:
        if "file" not in request.files:
            return jsonify({"error": "No file uploaded"}), 400

        file = request.files["file"]

        # Read the uploaded file
        if file.filename.endswith(".xlsx"):
            df = pd.read_excel(file)
        elif file.filename.endswith(".csv"):
            df = pd.read_csv(file)
        else:
            return jsonify({"error": "Unsupported file format"}), 400

        required_cols = ["Symbol", "Shares", "PurchasePrice", "CurrentPrice"]
        if not all(col in df.columns for col in required_cols):
            return jsonify({
                "error": f"File must include columns: {', '.join(required_cols)}"
            }), 400

        df["ROI (%)"] = ((df["CurrentPrice"] - df["PurchasePrice"]) / df["PurchasePrice"]) * 100
        df["ROI (%)"] = df["ROI (%)"].round(2)

        # Create portfolio summary
        portfolio_summary = df.to_dict(orient="records")

        # Send to OpenAI for analysis
        prompt = f"""
        Analyze this investment portfolio:
        {portfolio_summary}

        Provide:
        - Risk assessment
        - Diversification insight
        - 3–5 Buy/Hold/Sell recommendations
        - Short investment summary
        """

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a professional financial analysis assistant."},
                {"role": "user", "content": prompt},
            ],
            temperature=0.4,
        )

        ai_text = response.choices[0].message.content.strip()

        return jsonify({
            "status": "success",
            "analysis": ai_text,
            "roi_table": df.to_dict(orient="records"),
        }), 200

    except Exception as e:
        print("Error during AI analysis:", str(e))
        return jsonify({"error": str(e)}), 500
