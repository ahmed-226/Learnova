const validate = (schema) => (req, res, next) => {
  try {
    // If there's no schema, just proceed
    if (!schema) {
      return next();
    }

    // Check if we have a complex schema (with separate params/body/query objects)
    const isComplexSchema = schema.params || schema.body || schema.query;

    // For path parameters, if they exist in the request
    if (req.params && Object.keys(req.params).length > 0) {
    // Use params schema if available, otherwise skip param validation
      const paramsSchema = isComplexSchema ? schema.params : null;
      
      if (paramsSchema) {
        const { error: paramsError } = paramsSchema.validate(req.params, { abortEarly: false });
        
        if (paramsError) {
          logger.warn(`URL params validation error: ${paramsError.message}`);
          return res.status(HTTP_STATUS.BAD_REQUEST).json({
            error: 'Validation error',
            details: paramsError.details.map(detail => detail.message)
          });
        }
      }
    }

    // Determine what else to validate based on request method
    let validationTarget;
    let validationSchema;

    if (req.method === 'GET') {
    // For GET requests, validate query parameters
      validationTarget = req.query;
      validationSchema = isComplexSchema ? schema.query : schema;
    } else {
    // For other methods, validate request body
      validationTarget = req.body;
      validationSchema = isComplexSchema ? schema.body : schema;
    }

    // Skip if no suitable schema found
    if (!validationSchema) {
      return next();
    }

    // Perform validation
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