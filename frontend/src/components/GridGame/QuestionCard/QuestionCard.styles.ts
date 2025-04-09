import { css } from '@mui/material-pigment-css';

import { CARD_HEIGHT, CARD_WIDTH } from '../constants';

export const card = css({
  '& > *': {
    backfaceVisibility: 'hidden',
  },
  alignItems: 'center',
  borderRadius: '0.375em',
  display: 'flex',
  flexDirection: 'column',
  height: CARD_HEIGHT,
  justifyContent: 'center',
  overflow: 'visible',
  transformStyle: 'preserve-3d',
  transition: 'transform 600ms',
  width: CARD_WIDTH,
});

export const back = css({
  position: 'absolute',
  transform: 'rotateY(180deg)',
});
