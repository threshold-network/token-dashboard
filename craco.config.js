const path = require("path")

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.cache = {
        type: "filesystem",
      }

      // Find the rule that contains the Babel loader
      const oneOfRule = webpackConfig.module.rules.find((rule) =>
        Array.isArray(rule.oneOf)
      )
      if (oneOfRule) {
        const babelLoader = oneOfRule.oneOf.find(
          (rule) =>
            rule.loader &&
            rule.loader.includes("babel-loader") &&
            rule.options &&
            rule.options.presets
        )

        // Include @ledgerhq and @walletconnect packages in the Babel transpilation
        if (babelLoader) {
          // Ensure include is an array
          babelLoader.include = Array.isArray(babelLoader.include)
            ? babelLoader.include
            : [babelLoader.include]

          babelLoader.include = babelLoader.include.concat([
            path.resolve(__dirname, "node_modules/@ledgerhq"),
            path.resolve(__dirname, "node_modules/@walletconnect"),
            path.resolve(__dirname, "node_modules/ecpair"),
          ])
        }
      }

      return webpackConfig
    },
  },
}
