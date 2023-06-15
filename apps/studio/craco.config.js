/* eslint-disable */

const crypto = require('crypto');
const webpack = require('webpack');

function getFileLoaderRule(rules) {
  for (const rule of rules) {
    if ("oneOf" in rule) {
      const found = getFileLoaderRule(rule.oneOf);
      if (found) {
        return found;
      }
    } else if (rule.test === undefined && rule.type === 'asset/resource') {
      return rule;
    }
  }
  throw new Error("File loader not found");
}

function configureWebpack(webpackConfig) {
  // fallbacks
  const fallback = webpackConfig.resolve.fallback || {};
  Object.assign(fallback, {
    assert: require.resolve('assert/'),
    buffer: require.resolve('buffer'),
    http: require.resolve('stream-http'),
    https: require.resolve('https-browserify'),
    path: require.resolve('path-browserify'),
    stream: require.resolve('stream-browserify'),
    zlib: require.resolve('browserify-zlib'),
    url: require.resolve('url/'),
    util: require.resolve('util/'),
    fs: false,
  });
  webpackConfig.resolve.fallback = fallback;
  
  // aliases
  webpackConfig.resolve.alias = webpackConfig.resolve.alias || {};
  webpackConfig.resolve.alias['nimma/fallbacks'] = require.resolve('../../node_modules/nimma/dist/legacy/cjs/fallbacks/index.js');
  webpackConfig.resolve.alias['nimma/legacy'] = require.resolve('../../node_modules/nimma/dist/legacy/cjs/index.js');

  // plugins
  webpackConfig.plugins = (webpackConfig.plugins || []).concat([
    new webpack.ProvidePlugin({
      process: 'process/browser.js',
      Buffer: ['buffer', 'Buffer']
    })
  ]);

  // rules/loaders
  // workaround for https://github.com/facebook/create-react-app/issues/11889 issue
  const fileLoaderRule = getFileLoaderRule(webpackConfig.module.rules);
  fileLoaderRule.exclude.push(/\.cjs$/);
  webpackConfig.module.rules.push({
    test: /\.yml$/i,
    type: 'asset/source',
  });

  // ignore source-map warnings 
  webpackConfig.ignoreWarnings = [...(webpackConfig.ignoreWarnings || []), /Failed to parse source map/];

  return webpackConfig;
}

// Force method use SHA-256 to address OpenSSL 3.0 deprecation of MD4 algorithm
function configureCrypto() {
  const cryptCreateHashOrig = crypto.createHash;
  crypto.createHash = () => cryptCreateHashOrig('sha256');
}

function setEnvironments() {
  process.env.DISABLE_ESLINT_PLUGIN = true;
}

function configureCraco() {
  setEnvironments();
  configureCrypto();

  return {
    webpack: {
      configure: configureWebpack,
    }
  };
}

module.exports = configureCraco();
