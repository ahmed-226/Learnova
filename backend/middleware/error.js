const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  // Log the full error for debugging
  console.error('API Error:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    query: req.query,
    params: req.params
  });

  // Log to your logger
  logger.error(`Error: ${err.message} at ${req.method} ${req.path}`);

  // Handle Prisma errors specifically
  if (err.code && err.code.startsWith('P')) {
    console.error('Prisma Error:', err);
    return res.status(400).json({
      error: 'Database operation failed',
      details: err.message
    });
  }

  // Send appropriate response
  const statusCode = err.status || 500;
  const errorMessage = statusCode === 500 ? 'Internal server error' : err.message;
  
  res.status(statusCode).json({
    error: errorMessage,
    status: statusCode
  });
};

module.exports = errorHandler;