🧠 TradeLens-AI
🌍 Overview

TradeLens-AI is an AI-powered investment intelligence platform that combines real-time market analytics, portfolio insights, and AI recommendations into one unified dashboard.
It helps investors make smarter, data-driven decisions by integrating machine learning, financial APIs, and automated report generation.

The system is built as a modern full-stack web app:

Backend: Flask (Python) REST API for data processing, AI analysis, and authentication

Frontend: React + Bootstrap for a responsive, intuitive user interface

AI Engine: OpenAI API + trained ML model for prediction, summarization, and insights

⚙️ Core Features
🧾 Authentication

Secure login and registration using JWT tokens

Flask session handling with role-based access control

💼 Dashboard

Displays user’s personalized financial data and AI-generated insights

Pulls real-time market info and charts using integrated APIs (Polygon, NewsAPI, etc.)

📊 Analytics

Portfolio performance tracking and visual analytics

Interactive charts (profit/loss, asset distribution, etc.)

AI commentary on market trends

🧠 AI Recommendations

Daily trading insights fetched and summarized by GPT-4

Uses market headlines to generate brief actionable insights for investors

📰 Notifications

Financial news feed from NewsAPI

GPT summarization layer that extracts key trends and sentiment

🔍 Prediction (Optional ML model)

Fraud or anomaly detection model (trained on transaction dataset)

Flask endpoint for prediction requests


🧰 Tech Stack
Layer	Technology
Frontend	React.js, React-Bootstrap, Axios
Backend	Flask, SQLAlchemy, Python 3.11
Database	SQLite (can easily switch to PostgreSQL/MySQL)
AI/ML	OpenAI API (GPT-4), scikit-learn model
APIs Integrated	NewsAPI, Polygon.io (for stock data)
Auth	JWT tokens
Version Control	Git + GitHub
Deployment Ready	Supports Render / Vercel / Railway
🧪 Local Setup Instructions
1️⃣ Clone the Repository
git clone https://github.com/David-pixel-gif/TradeLens-AI.git
cd TradeLens-AI

2️⃣ Setup the Backend
cd backend
python -m venv venv
venv\Scripts\activate   # or source venv/bin/activate (Mac/Linux)
pip install -r requirements.txt


Create a .env file in backend/:

OPENAI_API_KEY=your_openai_key
NEWS_API_KEY=your_newsapi_key
POLYGON_API_KEY=your_polygon_key
SECRET_KEY=your_secret_key


Run the backend:

python app.py

3️⃣ Setup the Frontend
cd ../frontend
npm install
npm start


Now visit 👉 http://localhost:3000

💡 Future Enhancements

✅ Add portfolio rebalancing recommendations

✅ Integrate user watchlists

✅ Support voice-based AI assistant (speech-to-text via OpenAI Whisper)

✅ Add deployment configs (Docker, Railway, Render)

🧑‍💻 Contributors

Jonathan (David-pixel-gif) — Lead Developer

AI Assistant (GPT-5) — Architecture, documentation, and optimization help

🪙 License

This project is open-source under the MIT License — free to use, modify, and distribute with attribution.
