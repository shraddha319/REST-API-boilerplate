const express = require('express');
const { catchAsync } = require('../lib');
const { loginUser } = require('../controllers/auth.controller');
const { validate } = require('../middlewares');
const authValidation = require('../validations/auth.validation');

const router = express.Router();

router
  .route('/login')
  .post(validate(authValidation.login), catchAsync(loginUser));

module.exports = router;
