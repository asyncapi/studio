const path = require('path');

module.exports = {
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.resolve.alias['@__app__'] = path.resolve(__dirname, 'src');
    return config;
  },
}
