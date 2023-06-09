export default {
  "stories": ["../src/**/*.stories.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/addon-docs",
    "@storybook/addon-mdx-gfm",
    "@storybook/preset-typescript"
  ],
  "framework": {
    name: "@storybook/react-webpack5",
    options: {}
  },
  typescript: {
    reactDocgen: "react-docgen-typescript-plugin"
  },
  docs: {
    autodocs: true
  }
};