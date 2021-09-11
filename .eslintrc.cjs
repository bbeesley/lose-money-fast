module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'plugin:prettier/recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  plugins: ['jest', 'node'],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    'no-undef': 'error',
    '@typescript-eslint/indent': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'node/no-unsupported-features/es-syntax': 'off',
    strict: 0,
    quotes: ['error', 'single'],
    'node/no-unpublished-require': [
      'error',
      {
        allowModules: ['aws-sdk'],
      },
    ],
  },
  overrides: [
    {
      files: '**/*.test.*',
      rules: {
        '@typescript-eslint/explicit-function-return-type': 'off',
      },
    },
    {
      files: '*.cjs',
      rules: {
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
  ],
  env: {
    'jest/globals': true,
    es6: true,
    node: true,
  },
};
