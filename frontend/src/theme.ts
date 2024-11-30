import { createTheme } from "@mui/material/styles";
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
  cssVariables: true,
  colorSchemes: { light: true, dark: true },
  spacing: 12,
});
