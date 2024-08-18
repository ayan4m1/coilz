import globals from 'globals';
import reactRecommended from 'eslint-plugin-react/configs/recommended.js';
import reactHooks from 'eslint-plugin-react-hooks';
import prettierPlugin from 'eslint-plugin-prettier';

export default [
  {
    plugins: {
      reactRecommended,
      reactHooks,
      prettierPlugin
    },
    languageOptions: {
      globals: {
        ...globals.browser
      },
      parser: '@babel/eslint-parser'
    },
    rules: {
      'react/jsx-uses-react': 0,
      'react/jsx-sort-props': 2,
      'react/react-in-jsx-scope': 0
    },
    settings: {
      react: {
        version: 'detect'
      }
    }
  }
];
