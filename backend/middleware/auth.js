const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/env');
const { HTTP_STATUS } = require('../utils/constants');
const logger = require('../utils/logger');

const auth = (req, res, next) => {
  try {
    
    let token = req.cookies?.token;
    
    if (!token) {
      const authHeader = req.header('Authorization');
      if (authHeader) {
        token = authHeader.replace('Bearer ', '');
      }
    }
    
    if (!token) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({ error: 'Authentication required' });
    }
    
    const decoded = jwt.verify(token, JWT_SECRET);
    
    if (!decoded.id || !decoded.role) {
      logger.warn('Token missing required claims');
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({ error: 'Invalid token format' });
    }
    
    req.user = decoded;
    
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