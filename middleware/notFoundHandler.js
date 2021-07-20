const { ApplicationError } = require('../lib/index');

const notFoundHandler = (req, res, next) => {
  const err = new ApplicationError(
    `can't find ${req.originalUrl} on server`,
    404,
  );
  next(err);
};

module.exports = notFoundHandler;
