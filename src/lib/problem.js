const config = require('../lib/config');
const httpProblem = require('problem-json');

module.exports = (options) => {
  const url = `${config.app.protocol}://${config.app.hostname}${config.app.port !== 80 ? `:${config.app.port}` : ''}/api/problems`;
  options.type = `${url}/${options.type}`;
  return new httpProblem.Document(options);
}
