const chalk = require('chalk');
const wordWrap = require('word-wrap');
const emojis = require('emojis');

const logger = module.exports;

logger.chalk = chalk;

const highlightWords = (words, text) => {
  let result = text;

  words.filter(Boolean).forEach(word => {
    result = result.replace(new RegExp(word, 'g'), chalk.white(word));
  });

  return result;
};

logger.logLineWithBlock = (blockText, context, message, { highlightedWords = [], colorFn } = {}) => {
  colorFn = colorFn || chalk.reset.inverse.bold.green;
  blockText = emojis.unicode(blockText);
  context = emojis.unicode(context);
  message = emojis.unicode(message);
  message = highlightWords(highlightedWords, message);
  console.log(colorFn(` ${blockText} `), context, chalk.gray(message));
};

logger.logErrorLineWithBlock = (blockText, context, message, options) => {
  options.colorFn = chalk.reset.inverse.bold.red;
  logger.logLineWithBlock(blockText, context, message, options);
};

logger.logSuccessLine = (message, { highlightedWords = [] } = {}) => {
  message = highlightWords(highlightedWords, message);
  message = emojis.unicode(message);
  console.log(chalk.reset.green(' ✓'), chalk.gray(message));
};

logger.logErrorLine = (message, { highlightedWords = [] } = {}) => {
  message = highlightWords(highlightedWords, message);
  message = emojis.unicode(message);
  console.log(chalk.reset.red(' ✕'), chalk.gray(message));
};

logger.logErrorLineWithLongMessage = (message, longMessage, options) => {
  logger.logErrorLine(message, options);
  message = emojis.unicode(message);
  longMessage = typeof longMessage === 'string' ? emojis.unicode(longMessage) : longMessage;
  console.log(chalk.gray(wordWrap(longMessage, { width: options.width || 60, indent: ' '.repeat(options.indent || 5) })));
};
