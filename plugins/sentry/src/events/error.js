const { init, captureException, setUser } = require('../lib/sentry');

module.exports = ({ user, error, config, packageJSON }) => {
  init(config, packageJSON);
  setUser(user);
  captureException(error);
};
