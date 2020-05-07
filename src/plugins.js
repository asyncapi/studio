const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const chalk = require('chalk');
const pipeline = require('./lib/pipeline');
const { plugins } = require('../config/plugins.json');

const readFile = promisify(fs.readFile);

Promise.all(plugins.map(async (pluginPath) => {
  let packageJSON = await readFile(path.resolve(__dirname, '..', pluginPath, 'package.json'));
  packageJSON = JSON.parse(packageJSON);

  const config = packageJSON.asyncapihub;

  if (config.hooks) {
    const hookPoints = Object.keys(config.hooks);
    hookPoints.forEach(hookPoint => {
      const hookTargetPathsOrObjects = config.hooks[hookPoint];
      hookTargetPathsOrObjects.forEach(hookTargetPathOrObject => {
        try {
          let hookTargetPath;
          let hookTargetParams = {};

          if (typeof hookTargetPathOrObject === 'string') {
            hookTargetPath = hookTargetPathOrObject;
          } else {
            hookTargetPath = hookTargetPathOrObject.path;
            hookTargetParams = hookTargetPathOrObject.params;
          }

          const hookTarget = require(path.resolve(__dirname, '..', pluginPath, hookTargetPath));
          pipeline.append(hookPoint, hookTarget, hookTargetParams);

          console.log(chalk.reset.inverse.bold.green(' HOOK '), `${hookPoint} ${chalk.gray(hookTargetPath)}`);
        } catch (e) {
          console.log(chalk.reset.inverse.bold.red(' HOOK '), `${hookPoint} ${chalk.gray(hookTargetPath)}`);
        }
      });
    });
  }
}));
