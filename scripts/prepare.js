const { promises: { copyFile, readFile, mkdir, unlink } } = require('fs');
const path = require('path');
const plugins = require('../src/lib/plugins');
const { logLineWithBlock, logSuccessLine, logSkippingLine, logErrorLineWithLongMessage } = require('../src/lib/logger');

(async () => {
  for (let pluginName of plugins) {
    try {
      const absolutePluginPath = path.resolve(__dirname, '..', 'node_modules', pluginName);
      let packageJSON = await readFile(path.resolve(absolutePluginPath, 'package.json'));
      packageJSON = JSON.parse(packageJSON);

      const { name, version, asyncapistudio } = packageJSON;
      const pagePaths = Object.keys(asyncapistudio.pages || {});

      logLineWithBlock('PLUGIN', `${name}@${version}`, 'Preparing plugin for production deploy...');
      if (!pagePaths.length) {
        logSkippingLine(`Skipping as it doesn't have anything to prepare.`);
      }

      for (let pagePath of pagePaths) {
        let pageDefinition;
        let source;
        let destination;
        let relativeDestinationPath;

        try {
          pageDefinition = asyncapistudio.pages[pagePath];
          source = path.resolve(absolutePluginPath, pageDefinition.pagePath);
          destination = path.resolve(__dirname, '../src/pages/_plugins/', pagePath.startsWith('/') ? pagePath.substr(1) : pagePath);
          destination = destination.endsWith('.js') ? destination : `${destination}.js`;
          relativeDestinationPath = path.relative(path.resolve(__dirname, '..'), destination);

          await mkdir(path.dirname(destination), { recursive: true });
        } catch (e) {
          logErrorLineWithLongMessage(`Page ${pagePath}`, e.message, { highlightedWords: [pagePath] });
          return;
        }

        try {
          await unlink(destination);
        } catch (e) {
          if (e.code !== 'ENOENT') {
            logErrorLineWithLongMessage(`Page ${pagePath}`, e.message, { highlightedWords: [pagePath] });
            return;
          }
        }

        try {
          await copyFile(source, destination);
        } catch (e) {
          logErrorLineWithLongMessage(`Page ${pagePath}`, e.message, { highlightedWords: [pagePath] });
          return;
        }

        logSuccessLine(`Page ${pagePath} ${relativeDestinationPath}`, { highlightedWords: [pagePath] });
      }
    } catch (e) {
      console.error(e);
    }
  }
})();
