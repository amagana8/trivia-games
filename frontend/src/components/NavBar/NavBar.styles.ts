import { css } from '@mui/material-pigment-css';

export const navBar = css(({ theme }) => ({
  display: 'flex',
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  height: '4em',
  alignItems: 'center',
}));

export const title = css({
  flex: 1,
});
