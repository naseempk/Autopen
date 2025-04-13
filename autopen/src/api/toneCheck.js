import axios from "axios";

const API_URL =
  "https://api-inference.huggingface.co/models/cardiffnlp/twitter-roberta-base-sentiment";
const API_KEY = "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"; 

export const analyzeToneConsistency = async (text) => {
  try {
    const response = await axios.post(
      API_URL,
      { inputs: text },
      { headers: { Authorization: `Bearer ${API_KEY}` } }
    );

    console.log("API Response:", response.data); // Debugging API response

    if (response.data && response.data[0]) {
      const sentimentScores = response.data[0];

      // Extract highest confidence sentiment
      const highestSentiment = sentimentScores.reduce((prev, current) =>
        prev.score > current.score ? prev : current
      );

      const sentimentMap = {
        LABEL_0: "Negative",
        LABEL_1: "Neutral",
        LABEL_2: "Positive",
      };

      return {
        text,
        negative: sentimentScores[0].score.toFixed(2),
        neutral: sentimentScores[1].score.toFixed(2),
        positive: sentimentScores[2].score.toFixed(2),
        sentiment: sentimentMap[highestSentiment.label] || "Neutral",
        score: highestSentiment.score.toFixed(2),
      };
    }

    return null;
  } catch (error) {
    console.error("Error analyzing tone:", error.response ? error.response.data : error.message);
    return null;
  }
};

export const checkToneConsistency = (sections) => {
    if (!sections || sections.length < 2) return [];
  
    let flaggedSections = [];
    const sentimentValues = { Negative: -1, Neutral: 0, Positive: 1 };
  
    sections.forEach((section, index) => {
      if (index > 0) {
        const prevSentiment = sentimentValues[sections[index - 1].sentiment];
        const currSentiment = sentimentValues[section.sentiment];
  
        // Detect a drastic shift (change from Positive ↔ Negative)
        if (Math.abs(prevSentiment - currSentiment) > 1) {
          flaggedSections.push({
            index,
            text: section.text,
            sentiment: section.sentiment,
            explanation: `This sentence shifts tone drastically from the previous one.`,
            suggestion: "Try using a smoother transition or rephrasing.",
          });
        }
      }
    });
  
    console.log("Flagged Sections:", flaggedSections); // Debugging flagged issues
  
    return flaggedSections;
  };
  