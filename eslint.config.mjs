import js from '@eslint/js';
import globals from 'globals';
import reactPlugin from 'eslint-plugin-react';
import babelParser from '@babel/eslint-parser';
import prettierPlugin from 'eslint-plugin-prettier/recommended';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import { flatConfigs as importConfigs } from 'eslint-plugin-import-x';

export default [
  js.configs.recommended,
  importConfigs.recommended,
  importConfigs.react,
  reactPlugin.configs.flat['recommended'],
  reactHooksPlugin.configs.flat['recommended-latest'],
  {
    languageOptions: {
      globals: globals.browser,
      parser: babelParser,
      parserOptions: { requireConfigFile: false }
    },
    rules: {
      'react/jsx-uses-react': 0,
      'react/jsx-sort-props': 2,
      'react/react-in-jsx-scope': 0
    },
    settings: {
      react: { version: 'detect' },
      'import-x/resolver': { node: { paths: ['./src/'] } }
    }
  },
  { files: ['webpack.config.*'], languageOptions: { globals: globals.node } },
  prettierPlugin
];
