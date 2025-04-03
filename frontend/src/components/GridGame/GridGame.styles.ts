import { css } from '@mui/material-pigment-css';

export const root = css(({ theme }) => ({
  display: 'grid',
  gridTemplateAreas: `
  "sidebar main"
  "sidebar footer"
  `,
  gridTemplateColumns: 'auto 1fr',
  gridTemplateRows: '1fr auto',
  columnGap: theme.spacing(2),
  overflow: 'hidden',
}));

export const footer = css(() => ({
  gridArea: 'footer',
  display: 'flex',
  justifyContent: 'flex-end',
}));
