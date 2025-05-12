import { atom, injectPromise } from '@zedux/react';

import type { Column } from '../../../bff/src/pb/gridGame';
import { trpc } from '../trpc';

export const allGridGamesQueryAtom = atom('allGridGames', () => {
  const gridGamesPromise = injectPromise(
    () => trpc.gridGame.getMyGridGames.query(),
    [],
  );

  return gridGamesPromise;
});

export const gridGameAtom = atom<{ id: string; title: string; grid: Column[] }>(
  'gridGame',
  {
    grid: [{ category: '', questions: ['', '', '', '', ''] }],
    id: '',
    title: '',
  },
);
