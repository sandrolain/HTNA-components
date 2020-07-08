// https://github.com/storybookjs/storybook/blob/master/ADDONS_SUPPORT.md

// https://github.com/storybookjs/storybook/tree/master/addons/actions
// https://github.com/storybookjs/storybook-addon-console
// https://github.com/storybookjs/storybook/tree/next/addons/docs
// https://www.npmjs.com/package/@storybook/addon-backgrounds
// https://www.npmjs.com/package/@storybook/web-components

module.exports = {
  stories: ['../stories/**/*.stories.(ts|js|mdx)'],
  addons: [
    "@storybook/addon-actions/register",
    "@storybook/addon-backgrounds",
    "@storybook/addon-docs"
  ],
  webpackFinal: async config => {
    config.module.rules.push({
      test: /\.(ts|tsx)$/,
      use: [
        {
          loader: require.resolve('ts-loader'),
        }
      ],
    });
    config.resolve.extensions.push('.ts', '.tsx');

    // config.module.rules.push({
    //   test: /\.css$/i,
    //   use: ['css-loader'],
    // });

    return config;
  },
};
