export default {
  "stories": ["../src/**/*.stories.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    {
      name: "@storybook/addon-styling",
      options: {
        // Check out https://github.com/storybookjs/addon-styling/blob/main/docs/api.md
        // For more details on this addon's options.
        postCss: true,
      },
    },
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