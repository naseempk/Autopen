import express from "express";
import Draft from "../models/Draft.js";
import { getUserDrafts } from "../services/draftService.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Save Draft
router.post("/save-draft", authMiddleware, async (req, res) => { 
  console.log("📩 Received save draft request:", req.body);
  console.log("🔐 Extracted user from token:", req.user);

  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized: Token is missing or invalid" });
  }

  const { title, content, aiGeneratedContent, grammarErrors } = req.body;
  const userId = req.user.userId; // Extract from token
  
  if (!userId) {
    return res.status(400).json({ error: "User ID missing from token" });
  }

  try {
    const draft = new Draft({ userId, title, content, aiGeneratedContent, grammarErrors });
    
    await draft.save();
    res.status(201).json({ message: "Draft saved successfully", draft });
  } catch (error) {
    console.error("❌ Error saving draft:", error);
    res.status(500).json({ error: error.message });
  }
});


// Get User Drafts
router.get("/user-drafts/:userId", authMiddleware, async (req, res) => {
  const { userId } = req.params;
  const result = await getUserDrafts(userId);

  if (result.success) {
    res.status(200).json(result.data);
  } else {
    res.status(500).json({ error: result.error });
  }
});

router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const draft = await Draft.findById(req.params.id);

    console.log("📥 Requested draft ID:", req.params.id);
    console.log("🔐 Authenticated user ID:", req.user.userId);
    console.log("📄 Found draft:", draft);


    if (!draft || draft.userId.toString() !== req.user.userId) {
      return res.status(404).json({ error: "Draft not found" });
    }
    res.json(draft);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});


//  Delete Draft by ID
router.delete("/delete/:draftId", authMiddleware, async (req, res) => {
    try {
        const { draftId } = req.params;
        const draft = await Draft.findById(draftId);

        if (!draft) {
            console.error("❌ Draft not found:", draftId);
            return res.status(404).json({ error: "Draft not found" });
        }

        console.log("✅ Draft Owner ID:", draft.userId.toString()); 
        console.log("✅ User Attempting Delete:", req.user.userId);

        //  Fix Potential ObjectId Comparison Issue
        if (draft.userId.toString() !== req.user.userId) {
            console.error("❌ Unauthorized: User ID mismatch");
            return res.status(403).json({ error: "Unauthorized to delete this draft" });
        }

        await Draft.findByIdAndDelete(draftId);
        console.log("✅ Draft Deleted Successfully:", draftId);

        res.status(200).json({ message: "Draft deleted successfully" });
    } catch (error) {
        console.error("❌ Error deleting draft:", error);
        res.status(500).json({ error: "Failed to delete draft" });
    }
});
export default router;
