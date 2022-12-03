module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  plugins: ['svelte3'],
  extends: ['standard-with-typescript', 'prettier'],
  overrides: [
    {
      files: ['*.svelte'],
      processor: 'svelte3/svelte3',
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: 'tsconfig.json',
  },
  rules: {
    '@typescript-eslint/triple-slash-reference': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
  },
};
