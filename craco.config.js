module.exports = {
  babel: {
    plugins: [
      "@babel/plugin-proposal-numeric-separator",
      "@babel/plugin-proposal-logical-assignment-operators",
      "@babel/plugin-proposal-nullish-coalescing-operator",
      "@babel/plugin-proposal-optional-chaining",
      /*
       * Installed "@babel/plugin-transform-class-properties" to resolve
       * ECPair library error used by "@keep-network/tbtc-v2.ts"
       */
      ["@babel/plugin-transform-class-properties", { loose: true }],
    ],
  },
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      // Add a rule to handle .mjs files
      webpackConfig.module.rules.push({
        test: /\.mjs$/,
        include: /node_modules/,
        type: "javascript/auto",
      })

      return webpackConfig
    },
  },
}
