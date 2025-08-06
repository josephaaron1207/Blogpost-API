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

    // find user
    const user = await User.findOne({ email });
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
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,   // ✅ include role
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};