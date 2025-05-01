const winston = require('winston');
const path = require('path');

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.printf(({ level, message, timestamp, stack }) => {
    return `${timestamp} ${level.toUpperCase()}: ${message} ${stack || ''}`;
  })
);

// Create the logger instance
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: logFormat,
  defaultMeta: { service: 'learnova-api' },
  transports: [
    // Console transport for all environments
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        logFormat
      )
    }),
    
    // File transports for production
    ...(process.env.NODE_ENV === 'production' ? [
    // Error logs
      new winston.transports.File({ 
        filename: path.join('logs', 'error.log'), 
        level: 'error',
      // 5MB max size, 5 files
        maxsize: 5242880, 
        maxFiles: 5
      }),
    // Combined logs
      new winston.transports.File({ 
        filename: path.join('logs', 'combined.log'),
        maxsize: 5242880,
        maxFiles: 5
      })
    ] : [])
  ]
});

// Add a stream for Morgan HTTP request logging (if used)
logger.stream = {
  write: (message) => logger.http(message.trim())
};

// Development-specific settings
if (process.env.NODE_ENV !== 'production') {
  logger.debug('Logger running in development mode');
}

module.exports = logger;