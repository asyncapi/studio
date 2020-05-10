const { init, captureException } = require('../lib/sentry');

module.exports = ({ error, config }) => {
  init(config);
  captureException(error);
};
