import { css } from '@mui/material-pigment-css';

export const root = css(({ theme }) => ({
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(10),
  justifyContent: 'center',
}));

export const gameSelect = css({
  width: '50%',
});

export const playerCards = css(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
}));
