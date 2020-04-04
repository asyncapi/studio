const httpProblem = require('../lib/problem');

module.exports = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  if (req.header('Accept') === 'application/json') {
    return res.status(401).send(httpProblem({
      type: 'not-signed-in',
      title: 'You are not signed in.',
      detail: 'The current operation can only be performed by signed-in users.',
      instance: req.path,
      status: 401,
    }));
  }
  req.session.redirectUrl = req.originalUrl;
  res.redirect('/auth/signin');
};
