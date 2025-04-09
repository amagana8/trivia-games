import { css } from '@mui/material-pigment-css';

import { CARD_WIDTH } from '../../constants';

export const column = css(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  rowGap: theme.spacing(2),
  width: CARD_WIDTH,
}));

export const controls = css({
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'column',
});
