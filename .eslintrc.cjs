module.exports = {
  plugins: ['prettier'],
  overrides: [
    {
      parser: '@typescript-eslint/parser',
      files: ['**/*.ts'],
      extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
      rules: {
        'prettier/prettier': 'error',
      },
    },
  ],
};
