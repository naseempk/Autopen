import express from "express";
import Draft from "../models/Draft.js"; // Import the Draft model
import authMiddleware from "../middleware/authMiddleware.js"; // Ensure user is authenticated

const router = express.Router();

// 📌 Get all drafts for the logged-in user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const drafts = await Draft.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(drafts);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// 📌 Get a single draft by ID
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const draft = await Draft.findById(req.params.id);
    if (!draft || draft.userId.toString() !== req.user.id) {
      return res.status(404).json({ error: "Draft not found" });
    }
    res.json(draft);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// 📌 Create a new draft
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, content } = req.body;
    const newDraft = new Draft({
      userId: req.user.id,
      title,
      content,
    });
    await newDraft.save();
    res.status(201).json(newDraft);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// 📌 Update a draft
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { title, content } = req.body;
    const draft = await Draft.findById(req.params.id);

    if (!draft || draft.userId.toString() !== req.user.id) {
      return res.status(404).json({ error: "Draft not found" });
    }

    draft.title = title || draft.title;
    draft.content = content || draft.content;
    await draft.save();

    res.json(draft);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// 📌 Delete a draft
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const draft = await Draft.findById(req.params.id);
    if (!draft || draft.userId.toString() !== req.user.id) {
      return res.status(404).json({ error: "Draft not found" });
    }

    await draft.deleteOne();
    res.json({ message: "Draft deleted" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
