import sharedConfig from 'tailwind-config/tailwind.config.js';

module.exports = {
  content: ['./components/**/*.tsx'],
  presets: [sharedConfig],
  theme: {
    extend: {
      boxShadow: {
        active: '0px 0px 29px 0px rgba(190, 24, 93, 0.50)',
      },
    },
  }
};