const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');

const tokenVerifier = (req, res, next) => {
  const authToken = req.headers.authorization;
  const decoded = jwt.verify(authToken, JWT_SECRET);
  req.userId = decoded.userId;
  return next();
};

module.exports = tokenVerifier;
