module.exports = {
  root: true,
  env: { browser: true, es2022: true },
  extends: ['eslint:recommended', 'plugin:react/recommended', 'plugin:react/jsx-runtime', 'plugin:react-hooks/recommended'],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
  },
  plugins: ['react', 'react-refresh'],
  settings: {
    react: { version: 'detect' },
  },
  rules: {
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    'react/prop-types': 'off',
  },
  overrides: [
    {
      files: ['vite.config.js'],
      env: { node: true },
    },
  ],
};
