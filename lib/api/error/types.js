const ErrorTypes = {
  VALIDATION_ERROR: {
    code: 'VALIDATION_ERROR',
    statusCode: 400,
    message: 'Validation failed',
  },

  INVALID_ID: {
    code: 'INVALID_ID',
    statusCode: 400,
    message: 'ID is invalid',
  },

  RESOURCE_NOT_FOUND: {
    code: 'RESOURCE_NOT_FOUND',
    statusCode: 404,
    message: 'Resource not found',
  },

  SERVER_ERROR: {
    code: 'SERVER_ERROR',
    statusCode: 500,
    message: 'Something went wrong. Please try again later',
  },
};

module.exports = ErrorTypes;
