module.exports = {
  theme: {
    extend: {
      maxWidth: {
        '1/2': '50%',
      },
      minWidth: {
        '1/4': '25%',
      },
      backgroundColor: {
        'red-500-20': 'rgba(240, 82, 82, .2)',
      }
    },
  },
  plugins: [
    require('@tailwindcss/ui'),
  ],
}
