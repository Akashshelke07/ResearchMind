// server/src/middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - verify JWT token
const protect = async (req, res, next) => {
  let token;

  // Check for token in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'User not found'
        });
      }

      next();
    } catch (error) {
      console.error('Token verification error:', error);
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token failed'
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token'
    });
  }
};

// Check user role
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`
      });
    }
    next();
  };
};

// Check free tier limits
const checkFreeTierLimits = async (req, res, next) => {
  try {
    const user = req.user;
    
    if (!user.canMakeRequest()) {
      return res.status(429).json({
        success: false,
        message: 'Monthly request limit exceeded. Please upgrade to premium.',
        data: {
          currentUsage: user.usage.monthlyRequests,
          limit: process.env.FREE_TIER_REQUESTS_PER_MONTH || 50,
          resetDate: new Date(user.usage.lastResetDate.getFullYear(), user.usage.lastResetDate.getMonth() + 1, 1)
        }
      });
    }

    next();
  } catch (error) {
    console.error('Free tier check error:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking user limits'
    });
  }
};

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

module.exports = {
  protect,
  authorize,
  checkFreeTierLimits,
  generateToken
};