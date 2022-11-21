// eslint-disable-next-line
const crypto = require('crypto');         // Force method use SHA-256 to address
const cryptCreateHashOrig = crypto.createHash;     // OpenSSL 3.0 deprecation of
crypto.createHash = () => cryptCreateHashOrig('sha256');        // MD4 algorithm

module.exports = {
  style: {
    postcss: {
      plugins: [
        require('tailwindcss'),
        require('autoprefixer'),
      ],
    },
  },
  webpack: {
    configure: (webpackConfig) => { 
      webpackConfig.module.rules.push({
        test: /\.yml$/i,
        loader: 'raw-loader',
      });

      webpackConfig.resolve.alias = webpackConfig.resolve.alias || {};
      webpackConfig.resolve.alias['nimma/fallbacks'] = require.resolve('./node_modules/nimma/dist/legacy/cjs/fallbacks/index.js');
      webpackConfig.resolve.alias['nimma/legacy'] = require.resolve('./node_modules/nimma/dist/legacy/cjs/index.js');

      return webpackConfig;
    }
  }
};