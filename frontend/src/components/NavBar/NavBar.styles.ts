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
