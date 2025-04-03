import { css } from '@mui/material-pigment-css';

export const sidebar = css(({ theme }) => ({
  gridArea: 'sidebar',
  display: 'flex',
  flexDirection: 'column',
  paddingLeft: theme.spacing(1),
}));

export const list = css(({ theme }) => ({
  display: 'flex',
  flex: 1,
  flexDirection: 'column',
  rowGap: theme.spacing(1),
}));
