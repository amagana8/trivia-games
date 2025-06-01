import { MeetingRoom, PersonAdd, Send } from '@mui/icons-material';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  TextField,
} from '@mui/material';
import { useNavigate } from '@tanstack/react-router';
import React, { memo, useCallback, useState } from 'react';

import { MenuButton } from '../../components/MenuButton/MenuButton';
import { menuScreenStyles } from '../../styles/menuScreen.styles';
import { trpc } from '../../trpc';

export const PlaySelect: React.FC = memo(() => {
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleStartLobby = useCallback(async () => {
    const { gameRoomId } = await trpc.gameRoom.createGameRoom.mutate();
    navigate({ params: { gameRoomId }, to: '/lobby/$gameRoomId' });
  }, []);

  return (
    <>
      <div className={menuScreenStyles}>
        <MenuButton
          label="Host"
          onClick={handleStartLobby}
          icon={<MeetingRoom />}
        />

        <MenuButton
          label="Join"
          onClick={() => setIsDialogOpen(true)}
          icon={<PersonAdd />}
        />
      </div>

      <Dialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        slotProps={{
          paper: {
            component: 'form',
            onSubmit: (e: React.FormEvent<HTMLFormElement>) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);

              navigate({
                params: { gameRoomId: String(formData.get('lobbyId')) },
                to: '/lobby/$gameRoomId',
              });
            },
          },
        }}
      >
        <DialogTitle>Join Lobby</DialogTitle>

        <DialogContent>
          <TextField
            placeholder="Lobby Id"
            name="lobbyId"
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton type="submit">
                      <Send />
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
});
