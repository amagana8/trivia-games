import { atomWithRefresh } from 'jotai/utils';

import { trpc } from '../trpc';

export const currentUserAtom = atomWithRefresh(async () => {
  try {
    const currentUser = await trpc.user.getMe.query();
    return currentUser;
  } catch (error) {
    console.error('Error fetching current user:', error);
    return null;
  }
});
