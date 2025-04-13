import Draft from "../models/Draft.js"; // Import the Draft model

export const getUserDrafts = async (userId) => {
  try {

    const drafts = await Draft.find({ userId }).sort({ createdAt: -1 });

    return { success: true, data: drafts };
  } catch (error) {
    console.error("Error fetching drafts:", error);
    return { success: false, error: "Failed to fetch drafts" };
  }
};
