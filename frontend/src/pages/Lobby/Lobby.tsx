import { useParams } from '@tanstack/react-router';
import { useAtomValue } from '@zedux/react';
import { memo } from 'react';

import { GameStatus } from '../../../../bff/src/pb/gameRoom';
import { gameRoomAtom } from '../../atoms/gameRoom';
import { QuestionGrid } from '../../components/GridGame/QuestionGrid/QuestionGrid';
import { WaitingRoom } from './WaitingRoom/WaitingRoom';

export const Lobby: React.FC = memo(() => {
  const { gameRoomId } = useParams({ strict: false });

  const gameRoom = useAtomValue(gameRoomAtom, [gameRoomId]);

  switch (gameRoom.status) {
    case GameStatus.QUESTION_SELECT:
      return (
        <div>
          <QuestionGrid gridGameId={gameRoom.gameId} gameRoomId={gameRoomId} />
        </div>
      );
    default:
      return <WaitingRoom />;
  }
});
