import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import connectDB from "./db.js";
import authRoutes from "./routes/auth.js";
import draftRoutes from "./routes/draftRoutes.js";
import adminRoutes from "./routes/admin.js";
import feedbackRoute from "./routes/feedback.js";
import draftsRoutes from "./routes/drafts.js";
import authMiddleware from "./middleware/authMiddleware.js";
import userRoutes from "./routes/user.js";
// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); 
app.use(bodyParser.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/drafts", draftRoutes); 
app.use("/api/feedback", feedbackRoute);
app.use("/api/user", userRoutes);

app.get("/", (req, res) => {
  res.send("Backend is running locally with MongoDB!");
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Connect to MongoDB and start the server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  });
