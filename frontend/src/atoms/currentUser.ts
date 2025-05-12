import { atom, injectPromise } from '@zedux/react';

import { trpc } from '../trpc';

export const currentUserAtom = atom('currentUser', () => {
  const getMeApi = injectPromise(
    async () => {
      try {
        const currentUser = await trpc.user.getMe.query();
        return currentUser;
      } catch (error) {
        console.error('Error fetching current user:', error);
        return null;
      }
    },
    [],
    { runOnInvalidate: true },
  );

  return getMeApi;
});
