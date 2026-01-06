import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import mongoose from "mongoose";

dotenv.config();

// Connect to MongoDB
connectDB();

// Create Express app
const app = express();

// Middleware
app.use(express.json());

// ----------------------------
// Test MongoDB route
// ----------------------------
app.get("/test-db", async (req, res) => {
  try {
    await mongoose.connection.db.admin().ping();
    res.json({ message: "MongoDB is connected!" });
  } catch (err) {
    res.status(500).json({ message: "MongoDB connection failed", error: err.message });
  }
});

// ----------------------------
// Auth routes
// ----------------------------
app.use("/api/auth", authRoutes);

// ----------------------------
// Start server
// ----------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
