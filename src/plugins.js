const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const { logLineWithBlock, logErrorLineWithBlock } = require('./lib/logger');
const pipeline = require('./lib/pipeline');
const { plugins } = require('../config/plugins.json');

const readFile = promisify(fs.readFile);

Promise.all(plugins.map(async (pluginPath) => {
  let packageJSON = await readFile(path.resolve(__dirname, '..', pluginPath, 'package.json'));
  packageJSON = JSON.parse(packageJSON);

  const config = packageJSON.asyncapihub;
  const pluginName = packageJSON.name;

  if (config.hooks) {
    const hookPoints = Object.keys(config.hooks);
    hookPoints.forEach(hookPoint => {
      const hookTargetPathsOrObjects = config.hooks[hookPoint];
      hookTargetPathsOrObjects.forEach(hookTargetPathOrObject => {
        let hookTargetPath;
        let hookTargetParams = { pluginName };

        try {
          if (typeof hookTargetPathOrObject === 'string') {
            hookTargetPath = hookTargetPathOrObject;
          } else {
            hookTargetPath = hookTargetPathOrObject.path;
            hookTargetParams = { ...hookTargetParams, ...hookTargetPathOrObject.params };
          }

          const hookTarget = require(path.resolve(__dirname, '..', pluginPath, hookTargetPath));
          pipeline.append(hookPoint, hookTarget, hookTargetParams);

          logLineWithBlock('HOOK', hookPoint, hookTargetPath);
        } catch (e) {
          logErrorLineWithBlock('HOOK', hookPoint, hookTargetPath);
        }
      });
    });
  }
}));
