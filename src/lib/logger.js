const chalk = require('chalk');
const wordWrap = require('word-wrap');

const logger = module.exports;

logger.logLineWithBlock = (blockText, context, message, { highlightedWords = [], colorFn } = {}) => {
  colorFn = colorFn || chalk.reset.inverse.bold.green;
  highlightedWords.filter(Boolean).forEach(word => {
    message = message.replace(new RegExp(word, 'g'), chalk.white(word));
  });
  console.log(colorFn(` ${blockText} `), context, chalk.gray(message));
};

logger.logErrorLineWithBlock = (blockText, context, message, options) => {
  options.colorFn = chalk.reset.inverse.bold.red;
  logger.logLineWithBlock(blockText, context, message, options);
};

logger.logSuccessLine = (message, { highlightedWords = [] } = {}) => {
  highlightedWords.filter(Boolean).forEach(word => {
    message = message.replace(new RegExp(word, 'g'), chalk.white(word));
  });
  console.log(chalk.reset.green(' ✓'), chalk.gray(message));
};

logger.logErrorLine = (message, { highlightedWords = [] } = {}) => {
  highlightedWords.forEach(word => {
    message = message.replace(new RegExp(word, 'g'), chalk.white(word));
  });
  console.log(chalk.reset.red(' ✕'), chalk.gray(message));
};

logger.logErrorLineWithLongMessage = (message, longMessage, options) => {
  logger.logErrorLine(message, options);
  console.log(chalk.gray(wordWrap(longMessage, { width: options.width || 60, indent: ' '.repeat(options.indent || 5) })));
};
