import axios from "axios";

const API_KEY = "oP7TzeeLLU8rFiN7LXMHBLLuSIVSuu0mjF35RWhF";  
const API_URL = "https://api.cohere.com/v1/generate";

export const generateSuggestions = async (prompt) => {
  try {
    const response = await axios.post(
      API_URL,
      {
        model: "command-r-plus",
        prompt: `Suggest 200-300 words creative ideas and Give me only the main response without any introduction or extra text. Here is my input:\n\n${prompt}`,
        max_tokens: 400,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.generations.map((g) => g.text.trim());
  } catch (error) {
    console.error("Error generating suggestions:", error.response?.data || error.message);
    return [];
  }
};
