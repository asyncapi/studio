const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const { logLineWithBlock, logSuccessLine, logErrorLine } = require('./lib/logger');
const pipeline = require('./lib/pipeline');
const { plugins } = require('../config/plugins.json');

const readFile = promisify(fs.readFile);

Promise.all(plugins.map(async (pluginPath) => {
  let absolutePath;

  if (pluginPath.startsWith(`.${path.sep}`)) {
    absolutePath = path.resolve(__dirname, '..', pluginPath, 'package.json');
  } else {
    absolutePath = path.resolve(__dirname, '..', 'node_modules', pluginPath, 'package.json');
  }

  let packageJSON = await readFile(absolutePath);
  packageJSON = JSON.parse(packageJSON);

  const { name, version } = packageJSON;

  logLineWithBlock('PLUGIN', `${name}@${version}`, 'Registering plugin...');

  registerHooks(packageJSON, pluginPath);
}));

function registerHooks(packageJSON, pluginPath) {
  const { asyncapihub, name } = packageJSON;

  if (asyncapihub.hooks) {
    const hookPoints = Object.keys(asyncapihub.hooks);
    hookPoints.forEach(hookPoint => {
      const hookTargetPathsOrObjects = asyncapihub.hooks[hookPoint];
      hookTargetPathsOrObjects.forEach(hookTargetPathOrObject => {
        let hookTargetPath;
        let hookTargetParams = { name };

        try {
          if (typeof hookTargetPathOrObject === 'string') {
            hookTargetPath = hookTargetPathOrObject;
          } else {
            hookTargetPath = hookTargetPathOrObject.path;
            hookTargetParams = { ...hookTargetParams, ...hookTargetPathOrObject.params };
          }

          const hookTarget = require(path.resolve(__dirname, '..', pluginPath, hookTargetPath));
          pipeline.append(hookPoint, hookTarget, hookTargetParams);

          logSuccessLine(`Hook ${hookPoint} ${hookTargetPath}`, { highlightedWords: [hookPoint] });
        } catch (e) {
          logErrorLine(`Hook ${hookPoint} ${hookTargetPath}`, { highlightedWords: [hookPoint] });
        }
      });
    });
  }
}
