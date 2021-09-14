module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    "eslint-config-keep",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
  ],
  plugins: ["react"],
  rules: {
    "react/prop-types": 0,
    "react/display-name": 0,
    "no-invalid-this": 0,
  },
  settings: {
    react: {
      version: "detect",
    },
  },
}
