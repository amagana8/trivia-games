import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import sortKeysFix from 'eslint-plugin-sort-keys-fix';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default tseslint.config({
  extends: [js.configs.recommended, ...tseslint.configs.recommended, eslintPluginPrettierRecommended],
  files: ['**/*.{ts,tsx}'],
  plugins: {
    'simple-import-sort': simpleImportSort,
    'sort-keys-fix': sortKeysFix,
  },
  rules: {
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    'sort-keys-fix/sort-keys-fix': 'error',
  },
});
