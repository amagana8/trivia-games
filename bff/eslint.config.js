import tseslint from 'typescript-eslint';
import rootConfig from './eslint.config.js';

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [...rootConfig],
    files: ['**/*.ts'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
  },
);
