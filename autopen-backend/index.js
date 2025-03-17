import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import connectDB from "./db.js";
import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
connectDB().then(() => {
  // Start the server only after DB connection is successful
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
});

// Routes
app.use("/api/auth", authRoutes);

// Test API
app.get("/", (req, res) => {
  res.send("Backend is running locally with MongoDB!");
});