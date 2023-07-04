const defaultTheme = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')

module.exports = {
  content: [
    // app content
    `src/**/*.{js,ts,jsx,tsx}`,
    // include packages if not transpiling
    // '../../packages/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: colors.pink['600'],
        gray: colors.slate, // Use Slate gray as the default gray
        zinc: null, // The following are a list of grays. We just default to slate above.
        slate: null,
        neutral: null,
        stone: null,
        amber: null, // Amber is quite similar to Yellow. We don't need the two.
      },
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans]
      },
      fontSize: {
        '3xs': '8px',
      },
    },
  },
  plugins: [],
}