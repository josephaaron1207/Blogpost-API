//[SECTION] Dependencies and Modules
const bcrypt = require('bcrypt');
const User = require("../models/User"); // Ensure this import is present
const auth = require("../auth");

const { errorHandler } = auth;

//[SECTION] Check if the email already exists
module.exports.checkEmailExists = (req, res) => {
    // ...
};

//[SECTION] User registration
module.exports.registerUser = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    // Basic validation
    if (!email || !username || !password) {
      return res.status(400).json({ 
        message: "Email, username, and password are required" 
      });
    }

    // Additional validation
    if (password.length < 8) {
      return res.status(400).json({ 
        message: "Password must be at least 8 characters long" 
      });
    }

    if (username.length < 3) {
      return res.status(400).json({ 
        message: "Username must be at least 3 characters long" 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [
        { email: email.toLowerCase().trim() }, 
        { username: username.trim() }
      ] 
    });
    
    if (existingUser) {
      const field = existingUser.email === email.toLowerCase().trim() ? 'Email' : 'Username';
      return res.status(400).json({ 
        message: `${field} already exists. Please choose a different one.` 
      });
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ 
      email: email.toLowerCase().trim(), 
      username: username.trim(), 
      password: hashedPassword 
    });
    
    await user.save();
    
    res.status(201).json({ 
      message: "User registered successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
    
  } catch (err) {
    console.error('Registration error:', err);
    
    // Handle Mongoose validation errors
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(error => error.message);
      return res.status(400).json({ message: messages[0] }); // Return first error message
    }
    
    // Handle duplicate key errors (in case unique constraint fails)
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      const fieldName = field.charAt(0).toUpperCase() + field.slice(1);
      return res.status(400).json({ 
        message: `${fieldName} already exists. Please choose a different one.` 
      });
    }
    
    // Generic server error
    res.status(500).json({ message: "Internal server error. Please try again." });
  }
};


//[SECTION] User authentication
module.exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    
    // Generate JWT token
    const token = auth.createAccessToken(user);
    
    res.json({ 
      message: "User logged in successfully",
      access: token 
    });
    
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: "Internal server error" });
  }
};

//[Section] Activity: Retrieve user details
module.exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.send(user);
  } catch (err) {
    res.status(400).send({ message: "Error retrieving user profile" });
  }
};

//[Section] Activity: Update user profile
module.exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.username = req.body.username;
    user.email = req.body.email;
    await user.save();
    res.send({ message: "User profile updated successfully" });
  } catch (err) {
    res.status(400).send({ message: "Error updating user profile" });
  }
};

//[Section] Activity: Reset user password
module.exports.resetPassword = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    user.password = hashedPassword;
    await user.save();
    res.send({ message: "User password reset successfully" });
  } catch (err) {
    res.status(400).send({ message: "Error resetting user password" });
  }
};