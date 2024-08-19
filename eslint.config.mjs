import globals from 'globals';
import reactPlugin from 'eslint-plugin-react';
import babelParser from '@babel/eslint-parser';
import prettierPlugin from 'eslint-plugin-prettier';
import reactHooksPlugin from 'eslint-plugin-react-hooks';

export default [
  {
    plugins: {
      react: reactPlugin,
      reactHooks: reactHooksPlugin,
      prettierPlugin
    },
    languageOptions: {
      globals: {
        ...globals.browser
      },
      parser: babelParser
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
