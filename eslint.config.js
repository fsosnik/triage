import js from '@eslint/js';

export default [
  js.configs.recommended,
  {
    files: ['src/**/*.js'],
    rules: {
      'no-unused-vars': ['warn', { args: 'none' }],
      'no-console': 'off'
    }
  }
];
