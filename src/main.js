const plugins = require('./plugins.js');

plugins
  .init()
  .then(() => {
    require('./server.js');
  })
  .catch(console.error);
