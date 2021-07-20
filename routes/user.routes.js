/* eslint-disable no-unused-vars */
const express = require('express');
const { catchAsync } = require('../lib/index');
const validateUserRegistration = require('../middleware/validateUserRegistration');
const { postNewUser } = require('../controller/user.controller');

const router = express.Router();

router
  .route('/')
  .post(catchAsync(validateUserRegistration), catchAsync(postNewUser));

module.exports = router;
