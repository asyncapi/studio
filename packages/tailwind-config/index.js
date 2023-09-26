const colors = require('tailwindcss/colors')
const defaultConfig = require('tailwindcss/defaultConfig')
const config = require('./tailwind.config')

module.exports.colors = {
  ...colors,
  ...config.theme.extend.colors,
}

module.exports.spacing = {
  ...defaultConfig.theme.spacing,
  ...config.theme.extend.spacing,
}