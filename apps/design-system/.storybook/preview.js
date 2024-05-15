import '@asyncapi/studio-ui/styles.css'
import '../src/styles/tailwind.output.css'

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  backgrounds: {
    default: 'dark',
    values: [
      {
        name: 'dark',
        value: "#0F172A"
      },
      {
        name: 'light',
        value: "#e2e8f0"
      },
    ],
  },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}
