const nextTranspileModules = require('next-transpile-modules');
const { plugins } = require('./config/plugins.json');

const withTM = nextTranspileModules(plugins, { unstable_webpack5: true });

module.exports = withTM();
