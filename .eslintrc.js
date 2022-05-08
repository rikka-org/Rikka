module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'airbnb-base',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
  ],
  rules: {
    quotes: 0,
    "import/no-extraneous-dependencies": "off",
    "class-methods-use-this": "off",
    "import/no-unresolved": "off",
    "no-unused-vars": "off",
    "no-shadow": "off",
    "consistent-return": "off",
    "no-undef": "off",
  },
};
