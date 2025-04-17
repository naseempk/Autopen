import axios from "axios";

const API_URL = "https://api-inference.huggingface.co/models/facebook/bart-large-mnli";
const API_KEY = "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";

const GENRE_LABELS = [
  "Fantasy", "Science Fiction", "Mystery", "Horror", 
  "Romance", "Thriller", "Historical Fiction", "Adventure", 
  "Comedy", "Drama"
]; 

export const analyzeGenre = async (text) => {
  try {
    const response = await axios.post(
      API_URL,
      { 
        inputs: text, 
        parameters: { candidate_labels: GENRE_LABELS } 
      },
      { headers: { Authorization: `Bearer ${API_KEY}` } }
    );

    if (response.data && response.data.labels) {
      return response.data.labels[0]; 
    } else {
      return "Unknown Genre";
    }
  } catch (error) {
    console.error("Error analyzing genre:", error.response?.data || error);
    return "Error detecting genre";
  }
};
