const jwt = require('jsonwebtoken');
const User = require('./models/User');

exports.verify = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).send({ message: 'Access denied. No token provided.' });
    }

    // Extract token after "Bearer "
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');

    // Find the user in the DB to ensure still valid
    const user = await User.findById(decoded.id || decoded._id).select('-password');
    if (!user) {
      return res.status(401).send({ message: 'User not found or invalid token.' });
    }

    req.user = user; // attach full user to request
    next();
  } catch (err) {
    console.error('Verify error:', err.message);
    return res.status(400).send({ message: 'Invalid token.' });
  }
};

exports.isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user || user.role !== 'admin') {
      return res.status(401).send({ message: 'Only admins can delete posts and comments' });
    }
    next();
  } catch (err) {
    return res.status(500).send({ message: 'Server error checking admin role' });
  }
};
