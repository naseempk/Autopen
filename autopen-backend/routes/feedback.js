import express from "express";
import Feedback from "../models/Feedback.js"; // Use ES module import syntax

const router = express.Router();

// POST route to submit feedback
router.post("/", async (req, res) => {

  try {
    const { feedback } = req.body;

    // Validate feedback
    if (!feedback || feedback.trim() === "") {
      return res.status(400).json({ message: "Feedback cannot be empty." });
    }

    // Create new feedback entry
    const newFeedback = new Feedback({ feedback });
    await newFeedback.save();

    res.status(200).json({ message: "Feedback submitted successfully!" });
  } catch (error) {
    console.error("Error submitting feedback:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

export default router;
