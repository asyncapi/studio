/*eslint-env node*/

// eslint-disable-next-line @typescript-eslint/no-var-requires
const sharedConfig = require('tailwind-config/tailwind.config.js');

module.exports = {
  content: ['./src/**/*.tsx'],
  presets: [sharedConfig],
};
