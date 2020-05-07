const chalk = require('chalk');

const logger = module.exports;

logger.logLineWithBlock = (blockText, context, message, highlightedWords = [], colorFn) => {
  colorFn = colorFn || chalk.reset.inverse.bold.green;
  highlightedWords.forEach(word => {
    message = message.replace(new RegExp(word, 'g'), chalk.white(word));
  });
  console.log(colorFn(` ${blockText} `), context, chalk.gray(message));
};

logger.logErrorLineWithBlock = (blockText, context, message, highlightedWords = []) => {
  logger.logLineWithBlock(blockText, context, message, highlightedWords, chalk.reset.inverse.bold.red);
};
