module.exports = {
  babel: {
    plugins: [
      "@babel/plugin-proposal-nullish-coalescing-operator",
      "@babel/plugin-proposal-optional-chaining",
      /*
       * Installed "@babel/plugin-transform-class-properties" to resolve
       * ECPair library error used by "@keep-network/tbtc-v2.ts"
       */
      ["@babel/plugin-transform-class-properties", { loose: true }],
    ],
  },
}
