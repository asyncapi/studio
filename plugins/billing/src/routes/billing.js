module.exports = (req, res, next) => {
  req.nextApp.render(req, res, '/_plugins/settings/billing', req.params);
};
