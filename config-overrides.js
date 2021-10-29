// const rewireYAML = require('react-app-rewire-yaml');

module.exports = function override(config, env) {
  config.module.rules.push({
    test: /\.yml$/i,
    loader: 'raw-loader',
  });

  return config;
};
