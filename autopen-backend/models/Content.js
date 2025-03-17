import mongoose from "mongoose";

const contentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Content = mongoose.model("Content", contentSchema);
export default Content;
