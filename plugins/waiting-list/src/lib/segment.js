const Analytics = require('analytics-node');

class Segment {
  constructor(config) {
    this.config = config;
    this.analytics = new Analytics(config.segment.write_key);
  }

  logAddUserToWaitlist(user) {
    this.analytics.identify({
      userId: user.id,
      email: user.email,
      traits: user,
    });

    this.analytics.track({
      userId: user.id,
      email: user.email,
      event: 'New User added to Waiting List',
      properties: {
        displayName: user.displayName,
      },
    });
  }

  async logAddUserToWaitlistFailure(user, error) {
    this.analytics.identify({
      userId: user.id,
      email: user.email,
      traits: user,
    });

    this.analytics.track({
      userId: user.id,
      email: user.email,
      event: 'Add User to Waiting List failed',
      properties: error,
    });
  }
}

module.exports = Segment;
