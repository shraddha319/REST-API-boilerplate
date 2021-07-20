/* eslint-disable no-unused-vars */
const express = require('express');
const { catchAsync, ApplicationError, deepMerge } = require('../lib/index');
const { User } = require('../models/user.model');
const validateUserRegistration = require('../middleware/validateUserRegistration');
const validateUserId = require('../middleware/validateUserId');
const { postNewUser } = require('../controller/user.controller');

const router = express.Router();

router
  .route('/')
  .post(catchAsync(validateUserRegistration), catchAsync(postNewUser));

router.use('/:userId', catchAsync(validateUserId));

router
  .route('/:userId')
  .get((req, res) => {
    const { user } = req;
    res.json({
      status: 'success',
      data: {
        user,
      },
    });
  })
  .delete(
    catchAsync(async (req, res, next) => {
      const { user } = req;

      const removedUser = await user.remove();
      res.json({
        status: 'success',
        data: {
          // eslint-disable-next-line no-underscore-dangle
          userId: removedUser._id,
        },
      });
    }),
  );

module.exports = router;
