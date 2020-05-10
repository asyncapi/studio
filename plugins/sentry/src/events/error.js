const { init, captureException, setUser } = require('../lib/sentry');

module.exports = ({ user, error, config }) => {
  init(config);
  setUser(user);
  captureException(error);
};
