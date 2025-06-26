const createValidationError = (field, message) => {
  const error = new Error('Validation Error');
  error.name = 'ValidationError';
  error.errors = [{ field, message }];
  return error;
};

module.exports={
    createValidationError
}