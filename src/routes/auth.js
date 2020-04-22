const router = require('express').Router();
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const config = require('../lib/config');
const mailchimp = require('../lib/mailchimp');
const segment = require('../lib/segment');
const users = require('../handlers/users');
const isAuthenticated = require('../middlewares/is-authenticated');

module.exports = router;

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

passport.use(new GitHubStrategy({
  clientID: config.github.client_id,
  clientSecret: config.github.client_secret,
  callbackURL: config.github.callback_url,
  scope: 'user:email',
}, (accessToken, refreshToken, profile, done) => {
  users.createFromGithub({
    displayName: profile.displayName,
    email: profile._json.email || (profile.emails[0] && profile.emails[0].email ? profile.emails[0].email : `${profile.username}@failed-emails.com`),
    username: profile.username,
    avatar: profile._json.avatar_url,
    company: profile._json.company,
    githubId: profile.id,
    githubAccessToken: accessToken,
    githubRefreshToken: refreshToken,
  })
  .then((user) => {
    done(null, user);
  })
  .catch(done);
}
));

router.get('/signin', (req, res, next) => {
  if (req.user) return res.redirect('/');
  next(); // Handled by Next.js
});

router.post('/logout', isAuthenticated, (req, res, next) => {
  req.logOut();
  res.redirect('/');
});

router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get('/github/callback',
  passport.authenticate('github', { failureRedirect: '/auth/signin' }),
  (req, res) => {
    if (!req.user.feature_flags.betaActivated) {
      res.redirect('/landing/waiting-list');
      mailchimp.addUserToWaitingList(req.user);
      segment.logAddUserToWaitlist(req.user);
      return;
    }
    const redirectUrl = req.session.redirectUrl || null;
    req.session.redirectUrl = null;
    res.redirect(redirectUrl || '/');
  });
