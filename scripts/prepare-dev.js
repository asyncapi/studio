const { promises: { writeFile, copyFile }, constants: { COPYFILE_EXCL } } = require('fs');
const path = require('path');
const { logLineWithBlock, logSuccessLine, logSkippingLine, logErrorLineWithLongMessage } = require('../src/lib/logger');

(async () => {
  logLineWithBlock('UI', 'ui.json', 'Preparing UI for development...');
  try {
    await writeFile(path.resolve(__dirname, '..', 'config/ui.json'), '{}', { flag: 'wx' });
    logSuccessLine('Successfully created ui.json file.', { highlightedWords: ['ui.json'] });
  } catch (e) {
    if (e.code !== 'EEXIST') return logErrorLineWithLongMessage('Failed to create ui.json file', e.message);
    logSkippingLine('Skipping because ui.json file already exists.', { highlightedWords: ['ui.json'] });
  }
  
  logLineWithBlock('ENV', '.env', 'Preparing environment variables for development...');
  try {
    await copyFile(path.resolve(__dirname, '..', '.env-template'), path.resolve(__dirname, '..', '.env'), COPYFILE_EXCL);
    logSuccessLine('Successfully created .env file.', { highlightedWords: ['.env'] });
  } catch (e) {
    if (e.code !== 'EEXIST') return logErrorLineWithLongMessage('Failed to create .env file', e.message);
    logSkippingLine('Skipping because .env file already exists.', { highlightedWords: ['.env'] });
  }
})();
