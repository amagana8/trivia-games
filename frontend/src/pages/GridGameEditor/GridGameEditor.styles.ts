import { css } from '@mui/material-pigment-css';

export const root = css(({ theme }) => ({
  columnGap: theme.spacing(2),
  display: 'grid',
  gridTemplateAreas: `
  "sidebar main"
  "sidebar footer"
  `,
  gridTemplateColumns: 'auto 1fr',
  gridTemplateRows: '1fr auto',
  overflow: 'hidden',
}));

export const footer = css(() => ({
  display: 'flex',
  gridArea: 'footer',
  justifyContent: 'flex-end',
}));
