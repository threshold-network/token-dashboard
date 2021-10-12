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
  extends: "eslint-config-keep",
  plugins: ["react"],
  rules: {
    "react/prop-types": 0,
    "react/display-name": 0,
    "no-invalid-this": 0,
    "spaced-comment": 0,
    "react/jsx-uses-react": "off",
    "react/react-in-jsx-scope": "off",
    "no-unused-vars": 0,
  },
  settings: {
    react: {
      version: "detect",
    },
  },
}
