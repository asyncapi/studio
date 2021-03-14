require('../lib/config');
let { plugins } = require('../../config/plugins.json');
const envPlugins = process.env.PLUGINS;
if (envPlugins) plugins = plugins.concat(envPlugins.split(',').map(p => p.trim()))

// Remove potentially duplicated plugins
plugins = plugins.filter(function (p, pos) {
  return plugins.indexOf(p) == pos;
});

module.exports = plugins;