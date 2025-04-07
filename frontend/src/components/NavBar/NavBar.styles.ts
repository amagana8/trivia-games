import { css } from '@mui/material-pigment-css';

export const navBar = css(({ theme }) => ({
  alignItems: 'center',
  display: 'flex',
  height: '4em',
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
}));

export const title = css({
  flex: 1,
});

export const buttons = css({
  marginLeft: 'auto',
});

export const logo = css(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(0.5),
}));
