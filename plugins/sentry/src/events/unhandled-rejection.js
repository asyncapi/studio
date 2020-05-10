const { init, captureMessage } = require('../lib/sentry');

module.exports = ({ reason, promise, config }) => {
  init(config);
  captureMessage(reason, 'fatal');
};
