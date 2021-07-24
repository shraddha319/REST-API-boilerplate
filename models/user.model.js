const mongoose = require('mongoose');
const {
  validateDOB,
  validateUniqueField,
} = require('../middleware/validateUserRegistration');

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is a required field.'],
  },
  password: {
    type: String,
    required: [true, 'Password is a required field.'],
    minLength: [8, 'Password must be atleast 8 characters long.'],
  },
  firstName: {
    type: String,
    required: [true, 'First name is a required field.'],
  },
  lastName: { type: String },
  DOB: {
    type: Date,
    required: [true, 'Date Of Birth is required.'],
    validate: {
      validator: validateDOB,
      message: 'User must be atleast 13 years of age.',
    },
  },
});

/**
 * unique is not a validator. Only indicates it can be used for creating mongodb index
 * email - immutable, unique
 * password - 8 char, alpha + special
 * firstname, lastname - only alphabets
 * DOB - age above 13
 */

const User = mongoose.model('User', userSchema);

userSchema
  .path('email')
  .validate(validateUniqueField('email', 'User'), '{VALUE} already exists');

userSchema
  .path('firstName')
  .validate(validateUniqueField('firstName', 'User'), '{VALUE} already exists');

module.exports = { User, userSchema };
