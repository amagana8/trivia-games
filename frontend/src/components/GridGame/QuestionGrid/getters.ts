import { Ecosystem } from '@zedux/react';

import { currentUserAtom } from '../../../atoms/currentUser';
import { gameRoomAtom } from '../../../atoms/gameRoom';
import { gridGameAtom, gridGameQueryAtom } from '../../../atoms/gridGame';

export function getGridGame(
  { getNode, getOnce, get }: Ecosystem,
  gridGameId: string,
  gameRoomId?: string,
) {
  if (!gameRoomId) {
    return get(gridGameAtom, [gridGameId]);
  }

  const currentUser = getNode(currentUserAtom);
  const { hostId } = getOnce(gameRoomAtom, [gameRoomId]);

  if (currentUser.get().data?.userId === hostId) {
    return get(gridGameAtom, [gridGameId]);
  }

  return get(gridGameQueryAtom, [gridGameId]).data;
}
