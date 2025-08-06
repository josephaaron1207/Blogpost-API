// [SECTION] Dependencies and Modules
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// [SECTION] Routes
const userRoutes = require("./routes/user");
const postRoutes = require("./routes/post"); // <-- add post routes

// [SECTION] Server Setup
const app = express();
app.use(express.json());

// CORS setup
const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://localhost:5173",
    "https://your-frontend.onrender.com"
  ],
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// [SECTION] API Routes
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes); // <-- mount posts here

// [SECTION] Connect to DB & Start Server
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("✅ MongoDB Connected");
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch(err => console.error("❌ MongoDB connection error:", err));

module.exports = { app, mongoose };
