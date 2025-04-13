import mongoose from "mongoose";

const DraftSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    aiGeneratedContent: { type: String },
    grammarErrors: { type: Array }
}, { timestamps: true });

export default mongoose.model("Draft", DraftSchema);
