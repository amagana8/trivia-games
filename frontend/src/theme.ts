import { cyan, yellow } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';
import type { ExtendTheme } from '@pigment-css/react/theme';

declare module '@pigment-css/react/theme' {
  interface ThemeTokens {
    spacing: (factor: number) => number;
  }

  interface ThemeArgs {
    theme: ExtendTheme<{
      colorScheme: 'light' | 'dark';
      tokens: ThemeTokens;
    }>;
  }
}

export const theme = createTheme({
  colorSchemes: { dark: true, light: true },
  cssVariables: { colorSchemeSelector: 'data' },
  defaultColorScheme: 'dark',
  palette: {
    primary: cyan,
    secondary: yellow,
  },
  spacing: 12,
});
