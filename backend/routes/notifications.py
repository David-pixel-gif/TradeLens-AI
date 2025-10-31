from flask import Blueprint, jsonify
import requests
import os
from openai import OpenAI

notifications_bp = Blueprint("notifications", __name__)
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Example: you can use any news API of choice
NEWS_API_KEY = os.getenv("NEWS_API_KEY")
NEWS_URL = "https://newsapi.org/v2/top-headlines"

@notifications_bp.route("/api/notifications", methods=["GET"])
def get_notifications():
    try:
        # Fetch recent finance/business news
        params = {
            "category": "business",
            "q": "stocks OR investing OR finance OR markets",
            "language": "en",
            "apiKey": NEWS_API_KEY,
        }
        response = requests.get(NEWS_URL, params=params)
        articles = response.json().get("articles", [])[:6]

        # Prepare short summaries for OpenAI
        headlines = [f"{a['title']}" for a in articles if a.get("title")]

        ai_prompt = (
            "You're a financial analyst. "
            "Summarize key insights from these recent headlines and suggest one or two trading ideas:\n"
            + "\n".join(headlines)
        )

        ai_response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are an expert financial assistant."},
                {"role": "user", "content": ai_prompt},
            ],
            max_tokens=250,
        )

        summary = ai_response.choices[0].message.content.strip()

        data = {
            "news": articles,
            "ai_summary": summary,
        }

        return jsonify(data)

    except Exception as e:
        print(f"Error fetching notifications: {e}")
        return jsonify({"error": "Failed to load notifications"}), 500
