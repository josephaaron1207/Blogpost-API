const jwt = require('jsonwebtoken');
const User = require('./models/User');

exports.verify = async (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) {
    return res.status(401).send({ message: 'Access denied. No token provided.' });
  }
  try {
    const decoded = jwt.verify(token, 'secretkey');
    req.user = decoded;
    next();
  } catch (ex) {
    return res.status(400).send({ message: 'Invalid token.' });
  }
};

exports.isAdmin = async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (user.role !== 'admin') {
    return res.status(401).send({ message: 'Only admins can delete posts and comments' });
  }
  next(); // Add this line to properly close the function
};