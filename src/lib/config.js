const configLoader = require('./config-loader');
const config = require('../../config/common.json');

configLoader(config);

module.exports = config;
