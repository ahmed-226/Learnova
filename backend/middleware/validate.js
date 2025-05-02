const logger = require('../utils/logger');
const { HTTP_STATUS } = require('../utils/constants');


const validate = (schema) => (req, res, next) => {
  try {

    let validationTarget;
    let validationSchema;

    // Determine what to validate based on request method
    if (req.method === 'GET') {
    // For GET requests, validate query parameters
      validationTarget = req.query;
      validationSchema = schema.query || schema;
    } else {
    // For other methods, validate request body
      validationTarget = req.body;
      validationSchema = schema.body || schema;
    }

    // Validate URL parameters if schema includes params definition
    if (req.params && Object.keys(req.params).length > 0 && schema.params) {
      const { error: paramsError } = schema.params.validate(req.params, { abortEarly: false });
      if (paramsError) {
        logger.warn(`URL params validation error: ${paramsError.message}`);
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          error: 'Validation error',
          details: paramsError.details.map(detail => detail.message)
        });
      }
    }

    // Main validation (body or query)
    const { error, value } = validationSchema.validate(validationTarget, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      logger.warn(`Validation error: ${error.message}`);
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        error: 'Validation error',
        details: error.details.map(detail => detail.message)
      });
    }

    // Replace request data with validated and sanitized data
    if (req.method === 'GET') {
      req.query = value;
    } else {
      req.body = value;
    }

    next();
  } catch (error) {
    logger.error(`Validation middleware error: ${error.message}`);
    next(error);
  }
};

module.exports = validate;