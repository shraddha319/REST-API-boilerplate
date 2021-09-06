const Joi = require('joi');
const { password } = require('./custom.validation');

// TODO - test input schema

const login = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
  }),
};

module.exports = { login };
