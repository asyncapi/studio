const Analytics = require('analytics-node');
const config = require('./config');

const analytics = new Analytics(config.segment.write_key);

module.exports.logAddUserToWaitlist = async (user) => {
  analytics.identify({
    userId: user.id,
    email: user.email,
    traits: user,
  });

  analytics.track({
    userId: user.id,
    email: user.email,
    event: 'New User added to Waiting List',
    properties: {
      displayName: user.display_name,
    },
  });
};

module.exports.logAddUserToWaitlistFailure = async (user, error) => {
  analytics.identify({
    userId: user.id,
    email: user.email,
    traits: user,
  });

  analytics.track({
    userId: user.id,
    email: user.email,
    event: 'Add User to Waiting List failed',
    properties: error,
  });
};
