const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Allows requests from your frontend
app.use(express.json()); // Allows parsing of JSON in request bodies

// Database Connection
// Helpful debug: print where Node is looking and whether MONGO_URI is present
console.log("cwd:", process.cwd());
console.log("__dirname:", __dirname);
console.log(
  "MONGO_URI env present:",
  typeof process.env.MONGO_URI !== "undefined"
);

// Use a sensible local fallback to avoid crashing during development
const mongoUri =
  process.env.MONGO_URI || "mongodb://localhost:27017/flappyBird";

mongoose
  .connect(mongoUri)
  .then(() => console.log("MongoDB connected successfully."))
  .catch((err) => console.error("MongoDB connection error:", err));

// API Routes
const leaderboardRouter = require("./routes/leaderBoard");
app.use("/api/leaderboard", leaderboardRouter);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
