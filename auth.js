// auth.js
const jwt = require('jsonwebtoken');
const User = require('./models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'secretkey';

// Middleware to verify token
exports.verify = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1]; // extract token after "Bearer"
    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = decoded; // decoded should include _id and role
    next();
  } catch (error) {
    return res.status(400).json({ message: 'Invalid or expired token.' });
  }
};

// Middleware to check if user is admin
exports.isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can delete posts and comments.' });
    }

    next();
  } catch (error) {
    return res.status(500).json({ message: 'Error verifying admin role.' });
  }
};
