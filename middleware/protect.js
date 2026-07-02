const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    let token;

    // 1. Check token exists in header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    // 2. If no token found
    if (!token) {
      return res.status(401).json({
        message: 'Not authorized, no token'
      });
    }

    // 3. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Get user from database
    const user = await User.findById(decoded.id);

    // 5. If user not found
    if (!user) {
      return res.status(401).json({
        message: 'User no longer exists'
      });
    }

    // 6. Attach user to request
    req.user = user;

    // 7. Move to next middleware
    next();

  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({
        message: 'Invalid token'
      });
    }
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        message: 'Token expired, please login again'
      });
    }
    res.status(500).json({ message: err.message });
  }
};

module.exports = protect;