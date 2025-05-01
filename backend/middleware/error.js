// Global error handling middleware
const logger = require('../utils/logger');
const { HTTP_STATUS } = require('../utils/constants');


const errorHandler = (err, req, res, next) => {
  // Log the error
  logger.error(`${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  
  // Get appropriate status code
  const statusCode = err.status || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  
  // Send response with appropriate error message
  res.status(statusCode).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
};

module.exports = errorHandler;