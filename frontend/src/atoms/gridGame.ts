import { atom } from 'jotai';

import type { Column } from '../../../bff/src/pb/gridGame';
import { trpc } from '../trpc';

export const allGridGamesQueryAtom = atom(() => trpc.gridGame.getMyGridGames.query());

export const gridGameAtom = atom<{ id: string; title: string; grid: Column[] }>({
  grid: [{ category: '', questions: ['', '', '', '', ''] }],
  id: '',
  title: '',
});
