import { Apps, QuestionMark } from '@mui/icons-material';
import { useNavigate } from '@tanstack/react-router';
import { memo, useCallback } from 'react';

import { MenuButton } from '../../components/MenuButton/MenuButton';
import { menuScreenStyles } from '../../styles/menuScreen.styles';
import * as styles from './GameSelect.styles';

export const GameSelect: React.FC = memo(() => {
  const navigate = useNavigate();

  const handleNavigateToGridGame = useCallback(() => {
    navigate({ to: '/grid-game' });
  }, []);

  const handleNavigateToSpinnerGame = useCallback(() => {
    navigate({ to: '/spinner-game' });
  }, []);

  return (
    <div className={menuScreenStyles}>
      <MenuButton
        label="Grid"
        icon={<Apps />}
        onClick={handleNavigateToGridGame}
      />

      <MenuButton
        label="Spinner"
        icon={<QuestionMark />}
        onClick={handleNavigateToSpinnerGame}
        className={styles.disabled}
      />
    </div>
  );
});
