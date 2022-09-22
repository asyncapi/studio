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
      return webpackConfig;
    }
  }
};