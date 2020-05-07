module.exports = (req, res, next) => {
  if (!req.user) {
    res.statusCode = 404;
    return req.nextApp.render(req, res, '/_error', {});
  }

  req.nextHandle(req, res);
};
