module.exports = {
  root: true,
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  globals: {
    NodeJS: true,
  },
};
