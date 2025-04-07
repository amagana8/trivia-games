import { css } from '@mui/material-pigment-css';

export const card = css({
  '& > *': {
    backfaceVisibility: 'hidden',
  },
  alignItems: 'center',
  borderRadius: '0.375em',
  display: 'flex',
  height: '5em',
  justifyContent: 'center',
  overflow: 'visible',
  transformStyle: 'preserve-3d',
  transition: 'transform 600ms',
  width: '10em',
});

export const back = css({
  position: 'absolute',
  transform: 'rotateY(180deg)',
});
