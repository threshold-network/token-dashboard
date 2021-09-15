module.exports = {
  // stories: ['./*.stories.@(js|jsx|ts|tsx)'],
  stories: ["./button.stories.tsx"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/preset-create-react-app",
    "@snek-at/storybook-addon-chakra-ui",
  ],
}
