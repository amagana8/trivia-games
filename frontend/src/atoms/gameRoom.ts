import { atom, injectEffect, injectSignal } from '@zedux/react';

import { type GameRoomState, GameStatus } from '../../../bff/src/pb/gameRoom';
import { trpc } from '../trpc';

export const gameRoomAtom = atom('gameRoom', (gameRoomId: string) => {
  const gameRoomSignal = injectSignal<
    GameRoomState,
    {
      gameStatusUpdate: GameStatus;
    }
  >({
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

  injectEffect(() => {
    const cleanup = gameRoomSignal.on('change', ({ newState, oldState }) => {
      if (newState.status !== oldState.status) {
        gameRoomSignal.send('gameStatusUpdate', newState.status);
      }
    });

    return cleanup;
  }, []);

  return gameRoomSignal;
});
