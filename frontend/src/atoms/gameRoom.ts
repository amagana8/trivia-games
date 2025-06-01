import { atom, injectEffect, injectSignal } from '@zedux/react';

import { type GameRoomState, GameStatus } from '../../../bff/src/pb/gameRoom';
import { trpc } from '../trpc';

export const gameRoomAtom = atom('gameRoom', (gameRoomId: string) => {
  const gameRoomSignal = injectSignal<GameRoomState>({
    allowedPlayers: [],
    completedQuestions: [],
    currentPlayer: '',
    currentQuestion: '',
    gameId: '',
    gameRoomId: '',
    hostId: '',
    playerScores: {},
    status: GameStatus.UNKNOWN,
  });

  injectEffect(() => {
    const sub = trpc.gameRoom.joinGameRoom.subscribe(
      { gameRoomId },
      {
        onData(data) {
          gameRoomSignal.set(data);
        },
      },
    );

    return () => sub.unsubscribe();
  }, [gameRoomId]);

  return gameRoomSignal;
});
