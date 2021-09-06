const { ApplicationError, createError, sendResponse } = require('../lib');
const { NODE_ENV } = require('../config');

const errorHandler = (err, req, res, next) => {
  let error;
  if (!(err instanceof ApplicationError)) error = createError(err);
  else {
    error = { ...err };
    error.message = err.message;
  }

  if (NODE_ENV === 'dev') error.stack = err.stack;

  return sendResponse({
    res,
    success: false,
    payload: error,
    statusCode: error.statusCode,
  });
};

module.exports = errorHandler;
