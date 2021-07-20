/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
const { userSchema, User } = require('../models/user.model');
const { ApplicationError, getAge } = require('../lib/index');

const validateUserRegistration = async (req, res, next) => {
  const { user } = req.body;
  const rules = userSchema.obj;
  const errors = [];

  for (const key of Object.keys(rules)) {
    if (rules[key]?.required && !user[key]) {
      errors.push(`${key} is a required field.`);
    }
    if (rules[key]?.unique) {
      const result = await User.find({ [key]: user[key] });
      if (result?.length > 0)
        errors.push(`${key}: ${user[key]} is already in use.`);
    }
    if (key === 'DOB' && user[key] && getAge(user[key]) < 18) {
      errors.push('User must be 18 or above.');
    }
    if (key === 'password' && user[key] && user[key].length < 8) {
      errors.push('password must be atleast 8 characters long.');
    }
  }

  if (errors?.length > 0)
    return next(new ApplicationError(errors.join(' '), 400));
  return next();
};

module.exports = validateUserRegistration;
