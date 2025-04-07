import { Add, PlayArrow } from '@mui/icons-material';
import { useNavigate } from '@tanstack/react-router';
import { memo } from 'react';

import { MenuButton } from '../../components/MenuButton/MenuButton';
import { menuScreenStyles } from '../../styles/menuScreen.styles';

export const Home: React.FC = memo(() => {
  const navigate = useNavigate();

  return (
    <div className={menuScreenStyles}>
      <MenuButton label="Create" icon={<Add />} onClick={() => navigate({ to: '/select-game' })} />

      <MenuButton label="Play" icon={<PlayArrow />} onClick={() => {}} />
    </div>
  );
});
