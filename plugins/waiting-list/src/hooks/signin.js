const Mailchimp = require('../lib/mailchimp');
const Segment = require('../lib/segment');

module.exports = ({ req, res, config }, next) => {
  if (req.user.featureFlags && req.user.featureFlags.betaActivated) return next();

  res.redirect('/landing/waiting-list');

  const mailchimp = new Mailchimp(config);
  const segment = new Segment(config);

  mailchimp
    .addUserToWaitingList(req.user)
    .catch(err => {
      segment
        .logAddUserToWaitlistFailure(req.user, err)
        .catch(console.error);
    });
  segment.logAddUserToWaitlist(req.user);
};
