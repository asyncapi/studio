const router = require('express').Router();
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const config = require('../lib/config');

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
}, (accessToken, refreshToken, profile, done) => {
  return done(null, {
    displayName: profile.displayName,
    email: profile._json.email,
    avatar: profile._json.avatar_url,
    company: profile._json.company,
    github: profile._json,
  });
}
));

router.post('/logout', (req, res, next) => {
  req.logOut();
  res.redirect('/');
});

router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get('/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  (req, res, next) => {
    res.redirect('/');
  });
