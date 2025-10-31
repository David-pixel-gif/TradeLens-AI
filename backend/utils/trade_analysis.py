import pandas as pd
import numpy as np

# ---------------------------------------
# 🔧 Utility Functions
# ---------------------------------------

def compute_rsi(series, period=14):
    """Compute the Relative Strength Index (RSI)."""
    delta = series.diff()
    gain = delta.where(delta > 0, 0)
    loss = -delta.where(delta < 0, 0)
    avg_gain = gain.rolling(window=period, min_periods=1).mean()
    avg_loss = loss.rolling(window=period, min_periods=1).mean()
    rs = avg_gain / (avg_loss.replace(0, np.nan))
    rsi = 100 - (100 / (1 + rs))
    return rsi.fillna(50)

def compute_confidence(ma_short, ma_long):
    """Distance between MAs defines confidence."""
    diff = abs(ma_short - ma_long)
    confidence = (diff / ma_long) * 100
    return round(float(min(confidence, 100)), 2)

# ---------------------------------------
# 🧠 Interpretation Layer
# ---------------------------------------

def interpret_full(ticker, signal, rsi, volatility, confidence, latest_price):
    """
    Build a full natural-language interpretation for a financial advisor dashboard.
    """

    # --- Describe signal meaning ---
    if signal == "BUY":
        action_msg = f"{ticker} is showing bullish momentum. Short-term trends suggest a buying opportunity."
        advice_msg = "Consider entering or adding to your position while monitoring RSI for confirmation."
    elif signal == "SELL":
        action_msg = f"{ticker} is showing bearish pressure. Indicators suggest a potential downturn."
        advice_msg = "Consider taking profit or reducing exposure until the trend stabilizes."
    else:
        action_msg = f"{ticker} is currently stable with no clear directional bias."
        advice_msg = "Hold your position — wait for clearer market momentum before taking new action."

    # --- RSI meaning ---
    if rsi < 30:
        rsi_msg = "RSI indicates oversold conditions — possible rebound."
    elif rsi > 70:
        rsi_msg = "RSI indicates overbought conditions — a pullback may follow."
    else:
        rsi_msg = "RSI is neutral — balanced buying and selling pressure."

    # --- Volatility meaning ---
    if volatility > 3:
        vol_msg = "High volatility detected — expect price swings."
    elif volatility > 1:
        vol_msg = "Moderate volatility — steady market movement."
    else:
        vol_msg = "Low volatility — prices are relatively stable."

    # --- Confidence meaning ---
    if confidence > 80:
        conf_msg = "Signal strength: strong and reliable."
    elif confidence > 50:
        conf_msg = "Signal strength: moderate — confirm with trend continuation."
    else:
        conf_msg = "Signal confidence is low — proceed with caution."

    # Combine everything
    summary = f"{action_msg} {rsi_msg} {vol_msg} {conf_msg}"
    return {"summary": summary, "advice": advice_msg}


# ---------------------------------------
# 📈 Main Analysis Function
# ---------------------------------------

def analyze_stock(ticker, df: pd.DataFrame):
    """
    Perform a complete financial analysis of a single stock.
    Returns advisor-style insights.
    """

    if df.empty:
        return {"signal": "No Data", "summary": "No data available."}

    df = df.sort_values("timestamp").reset_index(drop=True)

    # Compute Moving Averages
    df["MA_5"] = df["close"].rolling(window=5, min_periods=1).mean()
    df["MA_10"] = df["close"].rolling(window=10, min_periods=1).mean()
    df["MA_10"].fillna(df["MA_5"], inplace=True)

    # Compute RSI and Volatility
    df["RSI"] = compute_rsi(df["close"])
    df["Volatility"] = df["close"].rolling(window=5, min_periods=1).std().fillna(0)

    latest = df.iloc[-1]
    prev = df.iloc[-2] if len(df) > 1 else latest

    # Determine signal based on MA crossover
    if latest["MA_5"] > latest["MA_10"] and prev["MA_5"] <= prev["MA_10"]:
        signal = "BUY"
    elif latest["MA_5"] < latest["MA_10"] and prev["MA_5"] >= prev["MA_10"]:
        signal = "SELL"
    else:
        signal = "HOLD"

    # Compute confidence
    confidence = compute_confidence(latest["MA_5"], latest["MA_10"])

    # Build interpretation
    text_analysis = interpret_full(
        ticker=ticker,
        signal=signal,
        rsi=latest["RSI"],
        volatility=latest["Volatility"],
        confidence=confidence,
        latest_price=latest["close"],
    )

    # Return rich, user-friendly analysis
    return {
        "ticker": ticker,
        "company_name": "Apple Inc." if ticker == "AAPL" else "Unknown Company",
        "sector": "Technology" if ticker == "AAPL" else "General",
        "analysis": {
            "latest_price": round(float(latest["close"]), 2),
            "ma_5": round(float(latest["MA_5"]), 3),
            "ma_10": round(float(latest["MA_10"]), 3),
            "rsi": round(float(latest["RSI"]), 2),
            "volatility": round(float(latest["Volatility"]), 3),
            "confidence": confidence,
            "signal": signal,
            "summary": text_analysis["summary"],
            "advice": text_analysis["advice"],
        },
    }
# For backward compatibility
analyze_trend = analyze_stock
