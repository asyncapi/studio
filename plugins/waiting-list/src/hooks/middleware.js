module.exports = (req, res, next) => {
  if (req.user && !(req.user.featureFlags && req.user.featureFlags.betaActivated)) {
    req.logout();
  }

  next();
};
