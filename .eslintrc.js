module.exports = {
  parser: 'babel-eslint',
  plugins: [
    'eslint-plugin-html',
  ],
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
    //'no-use-before-define': 1,
  },
};
