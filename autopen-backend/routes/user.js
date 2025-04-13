import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import authMiddleware from "../middleware/authMiddleware.js";
const router = express.Router();

// Middleware to verify user token
const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};

// GET user profile
router.get("/profile", authenticateUser, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });

    const userObj = user.toObject();
    if (typeof userObj.bio === "undefined") userObj.bio = ""; // Safe fallback

    res.json(userObj);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

// PUT update profile
router.put("/profile", authenticateUser, async (req, res) => {
  try {
    const updates = { name: req.body.name };
    if (typeof req.body.bio !== "undefined") updates.bio = req.body.bio;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.userId,
      updates,
      { new: true, runValidators: true }
    ).select("-password");

    const updatedUserObj = updatedUser.toObject();
    if (typeof updatedUserObj.bio === "undefined") updatedUserObj.bio = "";

    res.json({ user: updatedUserObj });
  } catch (err) {
    res.status(500).json({ error: "Failed to update profile" });
  }
});

// GET writing progress
router.get("/writing-progress", authMiddleware, async (req, res) => {
    try {
      const user = await User.findById(req.user.userId).select("writingStreak dailyWordGoal dailyWordCount");
      if (!user) return res.status(404).json({ error: "User not found" });
  
      res.json({
        writingStreak: user.writingStreak || 0,
        dailyWordGoal: user.dailyWordGoal || 500,
        dailyWordCount: user.dailyWordCount || 0,
      });
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch writing progress" });
    }
  });
  

  
// PUT /api/user/writing-progress
router.put("/writing-progress", authMiddleware, async (req, res) => {
    const { wordsWritten } = req.body;
  
    try {
      const user = await User.findById(req.user.userId);
      if (!user) return res.status(404).json({ error: "User not found" });
  
      const today = new Date().toDateString();
      const lastWritten = user.lastWrittenDate
        ? new Date(user.lastWrittenDate).toDateString()
        : null;
  
      // If last written was yesterday, increment streak
      if (lastWritten === new Date(Date.now() - 86400000).toDateString()) {
        user.writingStreak += 1;
      } 
      // If last written was today, just update the word count
      else if (lastWritten === today) {
        // No change to streak
      } 
      // If missed a day, reset streak
      else {
        user.writingStreak = 1;
      }
  
      user.lastWrittenDate = new Date();
      user.wordsWrittenToday = lastWritten === today
        ? user.wordsWrittenToday + wordsWritten
        : wordsWritten;
  
      await user.save();
  
      res.json({
        writingStreak: user.writingStreak,
        lastWrittenDate: user.lastWrittenDate,
        wordsWrittenToday: user.wordsWrittenToday,
      });
    } catch (err) {
      res.status(500).json({ error: "Failed to update writing progress" });
    }
  });
  
export default router;
