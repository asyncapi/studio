module.exports = function override(config) {
  config.module.rules.push({
    test: /\.yml$/i,
    loader: 'raw-loader',
  });

  return config;
};
