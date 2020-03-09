const crypto = require('crypto');
const config = require('./config');

module.exports.hashPassword = (rawPassword) => {
  return crypto.createHmac('sha256', config.crypto.secret).update(rawPassword).digest('hex');
};

module.exports.createApiKey = (owner) => {
  return crypto.createHmac('sha256', config.crypto.secret).update(`${owner}-${Date.now()}`).digest('hex')
};
