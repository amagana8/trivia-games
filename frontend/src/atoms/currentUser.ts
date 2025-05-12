import { api, atom } from '@zedux/react';

import { trpc } from '../trpc';

export const currentUserAtom = atom('currentUser', () => {
  const promise = trpc.user.getMe.query();

  return api(promise);
});
