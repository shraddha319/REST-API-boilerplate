const { User } = require('../models/user.model');

const postNewUser = async (req, res, next) => {
  const { user } = req.body;
  const savedUser = await User.create(user);
  res.status(201).json({
    status: 'success',
    data: {
      user: savedUser,
    },
  });
};

module.exports = {
  postNewUser,
};
