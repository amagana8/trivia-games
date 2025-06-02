import { ContentCopy, PlayArrow } from '@mui/icons-material';
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  Typography,
} from '@mui/material';
import { useParams } from '@tanstack/react-router';
import { useAtomValue } from '@zedux/react';
import { memo, useState } from 'react';

import { currentUserAtom } from '../../../atoms/currentUser';
import { gameRoomAtom } from '../../../atoms/gameRoom';
import { allGridGamesQueryAtom } from '../../../atoms/gridGame';
import { PlayerCard } from '../../../components/PlayerCard/PlayerCard';
import { trpc } from '../../../trpc';
import * as styles from './WaitingRoom.styles';

export const WaitingRoom: React.FC = memo(() => {
  const { gameRoomId } = useParams({ strict: false });

  const gameRoom = useAtomValue(gameRoomAtom, [gameRoomId]);
  const { data: currentUser } = useAtomValue(currentUserAtom);
  const [selectedGame, setSelectedGame] = useState<string>('');
  const { data: games } = useAtomValue(allGridGamesQueryAtom);
  const isHost = currentUser?.userId === gameRoom.hostId;
  const [openSnackbar, setOpenSnackbar] = useState(false);

  return (
    <>
      <div className={styles.root}>
        <div className={styles.gameSelect}>
          {isHost ? (
            <>
              <FormControl fullWidth>
                <InputLabel>Game</InputLabel>

                <Select
                  fullWidth
                  label="Game"
                  value={selectedGame}
                  onChange={(e) => setSelectedGame(e.target.value)}
                >
                  {Object.values(games).map((game) => (
                    <MenuItem key={game.gridGameId} value={game.gridGameId}>
                      {game.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </>
          ) : (
            <Typography>{gameRoom.gameId}</Typography>
          )}
        </div>

        <Button
          startIcon={<ContentCopy />}
          variant="outlined"
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            setOpenSnackbar(true);
          }}
        >
          Copy Invite Link
        </Button>

        {isHost && (
          <Button
            startIcon={<PlayArrow />}
            variant="contained"
            disabled={!selectedGame}
            onClick={() =>
              trpc.gameRoom.startGame.mutate({
                gameId: selectedGame,
                gameRoomId: gameRoom.gameRoomId,
                hostId: gameRoom.hostId,
              })
            }
          >
            Start Game
          </Button>
        )}

        <div className={styles.playerCards}>
          <PlayerCard playerId={gameRoom.hostId} isHost />

          {Object.keys(gameRoom.playerScores).map((playerId) => (
            <PlayerCard key={playerId} playerId={playerId} />
          ))}
        </div>
      </div>

      <Snackbar
        open={openSnackbar}
        onClose={() => setOpenSnackbar(false)}
        message="Copied Link"
        autoHideDuration={2000}
      />
    </>
  );
});
