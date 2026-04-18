require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const contactRoutes = require("./routes/contactRoutes");

const app = express();

// ─── Connect to MongoDB ───────────────────────────────────────────────────────
connectDB();

// ─── Middleware ───────────────────────────────────────────────────────────────

// CORS — Allow your frontend origin
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*", // Replace * with your actual frontend URL in production
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Parse JSON bodies
app.use(express.json({ limit: "10kb" }));

// Trust proxy (needed for rate limiting behind reverse proxy like Nginx)
app.set("trust proxy", 1);

// ─── Routes ───────────────────────────────────────────────────────────────────

// Health check
app.get("/", (req, res) => {
  res.json({
    status: "🟢 Server is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// Contact form routes
app.use("/api/contact", contactRoutes);

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.stack);
  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log(`📡 Health: http://localhost:${PORT}`);
  console.log(`📬 Home form: POST http://localhost:${PORT}/api/contact/home`);
  console.log(`📬 Contact form: POST http://localhost:${PORT}/api/contact/contact-page`);
  console.log(`📊 Submissions: GET http://localhost:${PORT}/api/contact/submissions\n`);
});
