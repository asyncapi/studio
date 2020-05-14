const nextTranspileModules = require('next-transpile-modules');
const { plugins } = require('./config/plugins.json');

const withTM = nextTranspileModules(plugins);

module.exports = withTM();
