const { User } = require('../models/user.model');
const { sendResponse } = require('../lib/index');

const postNewUser = async (req, res, next) => {
  const { user } = req.body;
  const savedUser = await User.create(user);
  // res.status(201).json({
  //   status: 'success',
  //   data: {
  //     user: savedUser,
  //   },
  // });
  return sendResponse({
    res,
    success: true,
    payload: { user: savedUser },
    statusCode: 201,
  });
};

module.exports = {
  postNewUser,
};
