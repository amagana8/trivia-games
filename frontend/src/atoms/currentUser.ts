import { trpc } from '../trpc';
import { atomWithRefresh } from 'jotai/utils';

export const currentUserAtom = atomWithRefresh(async () => {
  try {
    const currentUser = await trpc.user.getMe.query();
    return currentUser;
  } catch (error) {
    return null;
  }
});
