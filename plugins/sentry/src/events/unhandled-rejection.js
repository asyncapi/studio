const { init, captureMessage } = require('../lib/sentry');

module.exports = ({ reason, promise, config, packageJSON }) => {
  init(config, packageJSON);
  captureMessage(reason, 'fatal');
};
