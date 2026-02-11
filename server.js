import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";

import connectDB from "./config/db.js";
import reportRoutes from "./routes/reportRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🔑 FORCE load .env from backend root
dotenv.config({ path: path.join(__dirname, ".env") });

// Debug (remove later)
console.log("Loaded Gemini Key:", process.env.GEMINI_API_KEY);

// Connect MongoDB
connectDB();

const app = express();

// Middleware
app.use(express.json());

// CORS setup
const allowedOrigins = [
  "http://localhost:5173",
  "https://civicone.netlify.app",
  "https://civicone20.netlify.app"
];

app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/reports", reportRoutes);

// Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Root test
app.get("/", (req, res) => {
  res.send("Civicone Backend Running 🚀");
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
