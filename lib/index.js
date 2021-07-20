const ApplicationError = require('./api/error/applicationError');
const catchAsync = require('./api/error/catchAsync');
const { deepMerge, getAge } = require('./util/utils');
const connectDB = require('./db/db.connect');

module.exports = {
  ApplicationError,
  catchAsync,
  deepMerge,
  getAge,
  connectDB,
};
