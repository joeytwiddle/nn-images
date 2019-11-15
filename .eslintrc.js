module.exports = {
  parser: 'babel-eslint',
  extends: [
    'eslint:recommended',
  ],
  parserOptions: {
    ecmaVersion: 8,
  },
  env: {
    browser: true,
  },
  rules: {
    //'no-unused-vars': 0,
  },
};
