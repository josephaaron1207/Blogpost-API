const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Normalize email (though model will also do this)
    const emailNormalized = email.trim().toLowerCase();
    
    // Check if user already exists
    const existingUser = await User.findOne({ email: emailNormalized });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }
    
    // Create new user - let the model handle password hashing
    const newUser = new User({ 
      email: emailNormalized, 
      password: password  // Don't hash here - model will do it
    });
    
    await newUser.save();
    res.status(201).json({ message: "Registered successfully" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Registration failed" });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // normalize email
    const emailNormalized = email.trim().toLowerCase();

    // find user by normalized email
    const user = await User.findOne({ email: emailNormalized });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // create token
    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin }, // <-- include isAdmin here
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    // respond with token and user info (include isAdmin)
    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        isAdmin: user.isAdmin,   // <-- include isAdmin here
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};