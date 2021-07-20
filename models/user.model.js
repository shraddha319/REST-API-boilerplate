const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: { type: String },
  DOB: {
    type: Date,
    required: true,
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

module.exports = { User, userSchema };
