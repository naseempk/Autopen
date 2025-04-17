// src/api/DialoguesAPI.js
import axios from "axios";

const API_URL = "https://api.together.xyz/v1/chat/completions";
const API_KEY = "8e14ef55190350aa8840d63aa54957f30737255b3bc3df7ebc89f2594ec0de16"; 

export const generateDialogues = async (prompt) => {
  try {
    const response = await axios.post(
      API_URL,
      {
        model: "meta-llama/Llama-3.3-70B-Instruct-Turbo-Free",
        messages: [
          {
            role: "user",
            content: `Generate dialogues for the given scneario suiable for the character and situation and give me only the main response without any introduction or extra text. ${prompt}`,
          },
        ],
        max_tokens: 250,
        temperature: 0.7,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
      }
    );

    return response.data.choices.map(choice => choice.message.content);
  } catch (error) {
    console.error("Error generating dialogues:", error);
    return [];
  }
};
