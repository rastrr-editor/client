module.exports = {
  extends: ['plugin:svelte/recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
  env: {
    browser: true,
    es2021: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: __dirname,
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: 'tsconfig.json',
    extraFileExtensions: ['.svelte'],
  },
  plugins: ['@typescript-eslint', 'filename-rules'],
  globals: {
    Rastrr: true,
  },
  overrides: [
    {
      files: ['*.svelte'],
      parser: 'svelte-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser'
      },
      globals: {
        svelte: true,
      },
      rules: {
        'import/first': 'off', // import order cannot be determined correctly in .svelte components
      },
    },
  ],
  rules: {
    'filename-rules/match': [2, 'kebabcase'],
    '@typescript-eslint/triple-slash-reference': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/consistent-type-definitions': 'off',
    '@typescript-eslint/return-await': 'off',
  },
};
