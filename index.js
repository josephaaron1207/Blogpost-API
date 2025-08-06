// [SECTION] Dependencies and Modules
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// [SECTION] Environment Setup
require("dotenv").config();

// [SECTION] Routes
const userRoutes = require("./routes/user");

// [SECTION] Server Setup
const app = express();

app.use(express.json());


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

// Example posts route (add your real one if needed)
app.get("/api/posts", (req, res) => {
  res.json([
    { id: 1, title: "First Post", content: "Hello world!" },
    { id: 2, title: "Second Post", content: "Blogging is fun." }
  ]);
});

// [SECTION] Start Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = { app, mongoose };
