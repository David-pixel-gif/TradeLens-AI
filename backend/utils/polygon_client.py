from dotenv import load_dotenv
import os
import pandas as pd
from polygon import RESTClient

# ✅ Load your API key from config.env
load_dotenv(dotenv_path="config.env")
API_KEY = os.getenv("POLYGON_API_KEY")

# ✅ Initialize client
client = RESTClient(API_KEY)

# ✅ Main function for fetching stock data
def fetch_stock_data(ticker: str, start_date: str, end_date: str, timespan: str = "day"):
    """
    Fetch historical stock data from Polygon.io

    Args:
        ticker (str): Stock ticker symbol (e.g., 'AAPL')
        start_date (str): Start date (YYYY-MM-DD)
        end_date (str): End date (YYYY-MM-DD)
        timespan (str): Aggregation level ('minute', 'hour', 'day')

    Returns:
        pandas.DataFrame: DataFrame containing stock data
    """
    try:
        aggs = client.list_aggs(
            ticker=ticker,
            multiplier=1,
            timespan=timespan,
            from_=start_date,
            to=end_date,
            limit=5000,
        )
        df = pd.DataFrame([a.__dict__ for a in aggs])
        return df
    except Exception as e:
        print(f"❌ Error fetching stock data: {e}")
        return pd.DataFrame()
