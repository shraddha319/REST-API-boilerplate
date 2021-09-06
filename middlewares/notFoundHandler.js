const { ApplicationError, ErrorTypes } = require('../lib');

const { RESOURCE_NOT_FOUND } = ErrorTypes;

const notFoundHandler = (req, res, next) => {
  const error = new ApplicationError(RESOURCE_NOT_FOUND, {
    message: `${req.originalUrl} not found`,
  });
  next(error);
};

module.exports = notFoundHandler;
