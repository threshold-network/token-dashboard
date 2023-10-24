module.exports = {
  babel: {
    plugins: [
      "@babel/plugin-proposal-nullish-coalescing-operator",
      "@babel/plugin-proposal-optional-chaining",
      ["@babel/plugin-transform-class-properties", { loose: true }],
    ],
  },
}
