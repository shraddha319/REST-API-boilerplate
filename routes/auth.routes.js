const express = require('express');
const bcrypt = require('bcrypt');
const {
  catchAsync,
  sendResponse,
  ErrorTypes,
  ApplicationError,
} = require('../lib/index');
const { User } = require('../models/user.model');

const router = express.Router();
const { INVALID_PARAMETERS, AUTHENTICATION_ERROR } = ErrorTypes;

router.route('/login').post(
  catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password)
      return next(
        new ApplicationError(INVALID_PARAMETERS, {
          message: 'Email and password are required to authenticate',
        }),
      );

    const user = await User.findOne({ email });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return next(new ApplicationError(AUTHENTICATION_ERROR));
    /** generate jwt token */
    return sendResponse({ res, success: true, payload: { user } });
  }),
);

module.exports = router;
