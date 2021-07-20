const validateUserId = async (req, res, next) => {
  const { userId } = req.params;
  const user = await User.findById(userId);
  if (!user)
    return next(new ApplicationError(`can't find userId: ${userId}`, 404));
  req.userId = userId;
  req.user = user;
  return next();
};

module.exports = validateUserId;
