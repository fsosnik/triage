const js = require('@eslint/js');

module.exports = [
  {
    files: ['**/*.js'],
    languageOptions: { ecmaVersion: 2021 },
    rules: { 'no-console': 'warn', 'no-unused-vars': 'warn' }
  }
];
