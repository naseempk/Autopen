import express from "express";
import User from "../models/User.js"; 
import Draft from "../models/Draft.js"; 
import authMiddleware from "../middleware/authMiddleware.js"; 
import Feedback from "../models/Feedback.js";


const router = express.Router();


const isAdmin = (req, res, next) => {
  if (!req.user || req.user.email !== "admin@autopen.com") {
    return res.status(403).json({ error: "Access denied. Admins only." });
  }
  next();
};

// 🔹 Route 1: Get total user count
router.get("/users/count", authMiddleware, isAdmin, async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    res.json({ count: userCount });
  } catch (error) {
    console.error("Error fetching user count:", error);
    res.status(500).json({ error: "Error fetching user count" });
  }
});

// 🔹 Route 2: Get total document (draft) count
router.get("/documents/count", authMiddleware, isAdmin, async (req, res) => {
  try {
    const documentCount = await Draft.countDocuments(); // Fixed: Changed Document -> Draft
    res.json({ count: documentCount });
  } catch (error) {
    console.error("Error fetching document count:", error);
    res.status(500).json({ error: "Error fetching document count" });
  }
});

// 🔹 Route 3: Get all users
router.get("/users", authMiddleware, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-password"); // Exclude password field
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Error fetching users" });
  }
});


router.get("/documents", authMiddleware, isAdmin, async (req, res) => {
  try {
    const documents = await Draft.find().populate("userId"); // 👈 FIXED
    res.json(documents);
  } catch (error) {
    console.error("Error fetching documents:", error);
    res.status(500).json({ error: "Error fetching documents" });
  }
});


// 🔹 Route 5: Delete a user (Admin only)
router.delete("/users/:id", authMiddleware, isAdmin, async (req, res) => {
  try {
    const userId = req.params.id;

    // Prevent deleting the admin themselves
    if (req.user.email === "admin@autopen.com" && req.user.userId === userId) {
      return res.status(403).json({ error: "Admins cannot delete themselves" });
    }

    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Error deleting user" });
  }
});

// 🔹 Route 6: Edit user details (Admin only)
router.patch("/users/:id", authMiddleware, isAdmin, async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, email } = req.body;

    // Optional: check if email is already in use by another user
    const existingUser = await User.findOne({ email, _id: { $ne: userId } });
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use by another user." });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Error updating user" });
  }
});

router.delete("/drafts/:id", authMiddleware, isAdmin, async (req, res) => {
  try {
    const draftId = req.params.id;
    await Draft.findByIdAndDelete(draftId);
    res.status(200).json({ message: "Draft deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting draft:", err);
    res.status(500).json({ error: "Error deleting draft" });
  }
});

// Get all feedbacks
router.get("/feedbacks", authMiddleware, isAdmin, async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ submittedAt: -1 });
    res.json(feedbacks);
  } catch (error) {
    console.error("Error fetching feedbacks:", error);
    res.status(500).json({ message: "Failed to fetch feedbacks." });
  }
});

router.delete("/feedbacks/:id", authMiddleware, isAdmin, async (req, res) => {
  try {
    await Feedback.findByIdAndDelete(req.params.id);
    res.json({ message: "Feedback deleted." });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete feedback." });
  }
});




export default router;
