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

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = {
      id: decoded.id,
      // Map isAdmin → role
      role: decoded.role || (decoded.isAdmin ? 'admin' : 'user'),
      email: decoded.email || null,
    };

    next();
  } catch (error) {
    return res.status(400).json({ message: 'Invalid or expired token.' });
  }
};
