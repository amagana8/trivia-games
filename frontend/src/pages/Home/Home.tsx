import { Add, PlayArrow } from '@mui/icons-material';
import { useNavigate } from '@tanstack/react-router';
import { memo, useCallback } from 'react';

import { MenuButton } from '../../components/MenuButton/MenuButton';
import { menuScreenStyles } from '../../styles/menuScreen.styles';

export const Home: React.FC = memo(() => {
  const navigate = useNavigate();

  const handleNavigateToSelectGame = useCallback(() => {
    navigate({ to: '/select-game' });
  }, []);

  const handleNavigateToPlayGame = useCallback(() => {
    navigate({ to: '/play' });
  }, []);

  return (
    <div className={menuScreenStyles}>
      <MenuButton
        label="Create"
        icon={<Add />}
        onClick={handleNavigateToSelectGame}
      />

      <MenuButton
        label="Play"
        icon={<PlayArrow />}
        onClick={handleNavigateToPlayGame}
      />
    </div>
  );
});
