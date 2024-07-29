import globals from 'globals';
import pluginJs from '@eslint/js';
import pluginJest from 'eslint-plugin-jest';

export default [
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest, // Add Jest globals
      },
    },
  },
  pluginJs.configs.recommended,
  pluginJest.configs.recommended, // Add Jest plugin configuration
];
