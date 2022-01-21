module.exports = {
  "stories": [
    "../stories/**/*.stories.mdx",
    "../stories/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials"
  ],
  "framework": "@storybook/web-components",
  "staticDirs": ['../public'],
  refs: (config, { configType }) => {
    if (configType === 'DEVELOPMENT') {
      return {
        react: {
          title: 'React',
          url: 'http://localhost:7001'
        },
        vue: {
          title: 'Vue',
          url: 'http://localhost:7002'
        },
        angular: {
          title: 'Angular',
          url: 'http://localhost:7003'
        }
      }
    }
    // TODO production hosted urls
  }
}
