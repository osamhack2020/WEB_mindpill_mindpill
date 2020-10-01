module.exports = {
  env: {
    browser: true,
    'jest/globals': true,
    es2021: true
  },
  extends: [
    'plugin:prettier/recommended',
    'plugin:react/recommended',
    'standard'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 12,
    sourceType: 'module'
  },
  plugins: ['react', '@typescript-eslint', 'jest'],
  rules: {
    // Prettier에서 지원하지 않음
    'space-before-function-paren': 'never'
  }
}
