const webpack = require("webpack")

module.exports = {
  babel: {
    plugins: [
      "@babel/plugin-proposal-nullish-coalescing-operator",
      "@babel/plugin-proposal-optional-chaining",
      "@babel/plugin-proposal-logical-assignment-operators",
      /*
       * Installed "@babel/plugin-transform-class-properties" to resolve
       * ECPair library error used by "@keep-network/tbtc-v2.ts"
       */
      ["@babel/plugin-transform-class-properties", { loose: true }],
      ["@babel/plugin-proposal-private-methods", { loose: true }],
      ["@babel/plugin-proposal-private-property-in-object", { loose: true }],
    ],
  },
  jest: {
    configure: {
      transformIgnorePatterns: [
        "/node_modules/(?!(@starknet-react|axios|@walletconnect|uint8arrays|eventemitter3|multiformats|@keep-network/tbtc-v2.ts)/)",
      ],
      moduleNameMapper: {
        "^@ledgerhq/connect-kit-loader$":
          "<rootDir>/src/__mocks__/@ledgerhq/connect-kit-loader.js",
        "^@keep-network/tbtc-v2.ts/dist/src/bitcoin$":
          "@keep-network/tbtc-v2.ts",
        "^uint8arrays$": "<rootDir>/src/__mocks__/uint8arrays.js",
        "^multiformats$": "<rootDir>/src/__mocks__/multiformats.js",
      },
      globals: {
        "ts-jest": {
          useESM: true,
        },
      },
      testPathIgnorePatterns: ["/node_modules/", "/__mocks__/"],
    },
  },
  webpack: {
    configure: (webpackConfig) => {
      // Add webpack plugins
      webpackConfig.plugins = [
        ...webpackConfig.plugins,
        new webpack.ProvidePlugin({
          Buffer: ["buffer", "Buffer"],
          process: "process/browser",
        }),
      ]

      // Polyfill node modules for webpack 4
      webpackConfig.resolve.alias = {
        ...webpackConfig.resolve.alias,
        crypto: require.resolve("crypto-browserify"),
        stream: require.resolve("stream-browserify"),
        buffer: require.resolve("buffer"),
        starknet: require.resolve("starknet"),
      }

      webpackConfig.module.rules.push({
        test: /\.mjs$/,
        include: /node_modules/,
        type: "javascript/auto",
      })

      return webpackConfig
    },
  },
}
