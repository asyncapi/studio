module.exports = (req, res, next) => {
  if (!req.user) return next();

  req.userPublicInfo = {
    id: req.user.id,
    displayName: req.user.display_name,
    username: req.user.username,
    email: req.user.email,
    avatar: req.user.avatar,
    company: req.user.company,
  };

  next();
};
