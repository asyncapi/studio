import '@asyncapi/studio-ui/styles.css'

export const parameters = {
  backgrounds: {
    values: [
      { name: 'light', value: '#ffffff' },
      { name: 'dark', value: '#0F172A' },
    ],
  },
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}