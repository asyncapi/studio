/** @type {import('tailwindcss').Config} */

const colorPrimary = {
  100: '#F4EFFC',
  200: '#E0D1FC',
  300: '#CAB0FC',
  400: '#A87EFC',
  500: '#8851FB',
  600: '#461E96'
};

const colorSecondary = {
  100: '#EDFAFF',
  200: '#CCF0FF',
  300: '#B2E8FF',
  400: '#80D9FF',
  500: '#47BCEE',
  600: '#1AA9C9'
}

const colorPink = {
  50: '#FCE7F5',
  100: '#FACFEB',
  200: '#F59FD6',
  300: '#EF6EC2',
  400: '#EA3EAD',
  500: '#E50E99',
  600: '#B70B7A',
  700: '#89085C',
  800: '#5C063D',
  900: '#2E031F'
}

const colorYellow = {
  50: '#FFFAEC',
  100: '#FFF6D9',
  200: '#FFEDB2',
  300: '#FFE48C',
  400: '#FFDB65',
  500: '#FFD23F',
  600: '#CCA832',
  700: '#997E26',
  800: '#665419',
  900: '#332A0D'
}

const colorGray = {
  50: '#F9FAFB',
  100: '#F3F4F6',
  200: '#E5E7EB',
  300: '#D1D5DB',
  400: '#9CA3AF',
  500: '#6B7280',
  600: '#4B5563',
  700: '#374151',
  800: '#1F2937',
  900: '#111827'
}


module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './public/index.html',
  ],
  darkMode: 'media', // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: colorPrimary,
        secondary: colorSecondary, 
        pink: colorPink,
        yellow: colorYellow,
        gray: colorGray,
      },
    },
    fontFamily: {
      'sans': ['Inter', 'sans-serif'],
      'heading': ['Work Sans', 'sans-serif'],
      'body': ['Inter', 'sans-serif']
    },
    letterSpacing: {
      heading: '-0.03em',
      body: '-0.01em'
    },
  },
  variants: {
    extend: {
    },
  },
  plugins: [
  ],
}