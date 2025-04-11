const path = require("path")

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
      // Add these plugins to fix the "loose" option warnings
      ["@babel/plugin-proposal-private-methods", { loose: true }],
      ["@babel/plugin-proposal-private-property-in-object", { loose: true }],
    ],
  },
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      // Improve .mjs file handling - compatible with webpack 4
      webpackConfig.module.rules.push({
        test: /\.mjs$/,
        include: /node_modules/,
        type: "javascript/auto",
      })

      // Add special handling for Suiet Wallet Kit
      webpackConfig.module.rules.push({
        test: /@suiet\/.*\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            plugins: ["@babel/plugin-transform-modules-commonjs"],
          },
        },
      })

      // Add resolve extensions to handle .mjs
      webpackConfig.resolve.extensions.push(".mjs")

      // Add ProvidePlugin to make Buffer available - webpack 4 compatible way
      const webpack = require("webpack")
      webpackConfig.plugins.push(
        new webpack.ProvidePlugin({
          Buffer: ["buffer", "Buffer"],
          process: path.resolve(__dirname, "src/shims/process-browser.js"),
        })
      )

      // Define process.browser = true
      webpackConfig.plugins.push(
        new webpack.DefinePlugin({
          "process.browser": true,
        })
      )

      // For webpack 4, use resolver.alias and resolveLoader instead of fallback
      webpackConfig.resolve.alias = {
        ...webpackConfig.resolve.alias,
        crypto: require.resolve("crypto-browserify"),
        stream: require.resolve("stream-browserify"),
        buffer: require.resolve("buffer"),
        process: path.resolve(__dirname, "src/shims/process-browser.js"),
        "process/browser": path.resolve(
          __dirname,
          "src/shims/process-browser.js"
        ),
        path: require.resolve("path-browserify"),
      }

      // Ignore specific modules that cause issues
      webpackConfig.plugins.push(
        new webpack.IgnorePlugin({
          resourceRegExp: /^\.\/locale$/,
          contextRegExp: /moment$/,
        }),
        new webpack.IgnorePlugin({
          resourceRegExp: /^unstorage$/,
        })
      )

      // Add null-loader for problematic files
      webpackConfig.module.rules.push({
        test: /unstorage|@suiet\/wallet-kit\/dist\/style\.css$/,
        use: "null-loader",
      })

      return webpackConfig
    },
  },
}
