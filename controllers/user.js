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
  const { email, username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ email, username, password: hashedPassword });
  try {
    await user.save();
    res.send({ message: "User registered successfully" });
  } catch (err) {
    res.status(400).send({ message: "Error registering user" });
  }
};

//[SECTION] User authentication
module.exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).send({ message: "Invalid email or password" });
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).send({ message: "Invalid email or password" });
    }
    res.send({ message: "User logged in successfully" });
  } catch (err) {
    res.status(400).send({ message: "Error logging in user" });
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