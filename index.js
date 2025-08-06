// [SECTION] Dependencies and Modules
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
// Google Login
const passport = require('passport');
const session = require('express-session');
// require('./passport');

// [SECTION] Environment Setup
// const port = 4000;
require('dotenv').config();

//[SECTION] Routes
const userRoutes = require("./routes/user");
const e = require("express");

// [SECTION] Server Setup
const app = express();

app.use(express.json());

const corsOptions = {
  origin: ['http://localhost:5173'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

console.log('Server is running on port 4000');

module.exports = { app, mongoose };