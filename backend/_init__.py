// apiService.ts
import axios from "axios";

// Set base URL using environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export const getRecommendation = async (symbol: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/recommend/${symbol}`, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error fetching recommendation:", error.message);
    throw error;
  }
};
