import { css } from '@mui/material-pigment-css';

export const gridControls = css(() => ({
  alignItems: 'center',
  display: 'flex',
}));

export const root = css(() => ({
  display: 'flex',
  gridArea: 'main',
  overflow: 'auto',
}));
