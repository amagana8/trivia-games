import { pigment } from '@pigment-css/vite-plugin';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

import { theme } from './src/theme';

const pigmentConfig = {
  theme,
  transformLibraries: ['@mui/material'],
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), pigment(pigmentConfig)],
});
