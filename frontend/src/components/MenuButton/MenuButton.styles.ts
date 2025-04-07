import { css } from '@mui/material-pigment-css';

export const cardMedia = css({
  alignItems: 'center',
  display: 'flex',
  justifyContent: 'center',
});

export const card = css({
  width: '5em',
});

export const actionArea = css(({ theme }) => ({
  padding: theme.spacing(1),
}));
