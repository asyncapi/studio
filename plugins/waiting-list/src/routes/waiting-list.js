module.exports = (req, res, next) => {
  if (!req.user) return next(); // 404
  if (req.user.featureFlags && req.user.featureFlags.betaActivated === true) return next(); // 404

  req.nextApp.render(req, res, '/_plugins/landing/waiting-list', {});
};
