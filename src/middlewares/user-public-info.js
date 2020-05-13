const { filterUserWithPublicInfo } = require('../handlers/users');

module.exports = (req, res, next) => {
  if (!req.user) return next();
  req.userPublicInfo = filterUserWithPublicInfo(req.user);
  next();
};
