// [SECTION] Dependencies and Modules
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// [SECTION] Environment Setup
require('dotenv').config();

//[SECTION] Routes
const userRoutes = require("./routes/user");

// [SECTION] Server Setup
const app = express();

app.use(express.json());

const corsOptions = {
  origin: ['http://localhost:5173'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.listen(4000, () => {
  console.log('Server is running on port 4000');
});

module.exports = { app, mongoose };