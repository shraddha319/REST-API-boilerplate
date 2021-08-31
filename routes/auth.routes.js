const express = require('express');
const { catchAsync } = require('../lib');
const { loginUser } = require('../controller/auth.controller');

const router = express.Router();

router.route('/login').post(catchAsync(loginUser));

module.exports = router;
