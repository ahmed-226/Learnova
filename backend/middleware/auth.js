// Authentication middleware (JWT)
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/env');
const { HTTP_STATUS } = require('../utils/constants');
const logger = require('../utils/logger');

/**
 * Authentication middleware
 * Verifies JWT token and adds user data to request object
 */
const auth = (req, res, next) => {
  try {
    // Check for token in Authorization header
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({ error: 'Authentication required' });
    }

    // Extract token from Bearer format
    const token = authHeader.replace('Bearer ', '');
    if (!token) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({ error: 'Invalid authorization format' });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Check for required claims
    if (!decoded.id || !decoded.role) {
      logger.warn('Token missing required claims');
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({ error: 'Invalid token format' });
    }

    // Add user data to request
    req.user = decoded;
    
    // Continue to next middleware/route handler
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      logger.warn(`Authentication failed: ${error.message}`);
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({ error: 'Invalid or expired token' });
    }
    
    logger.error(`Authentication error: ${error.message}`);
    next(error);
  }
};

module.exports = auth;