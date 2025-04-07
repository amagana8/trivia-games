import { Apps, QuestionMark } from '@mui/icons-material';
import { useNavigate } from '@tanstack/react-router';
import { memo } from 'react';

import { MenuButton } from '../../components/MenuButton/MenuButton';
import { menuScreenStyles } from '../../styles/menuScreen.styles';
import * as styles from './GameSelect.styles';

export const GameSelect: React.FC = memo(() => {
  const navigate = useNavigate();

  return (
    <div className={menuScreenStyles}>
      <MenuButton label="Grid" icon={<Apps />} onClick={() => navigate({ to: '/grid-game' })} />

      <MenuButton label="Spinner" icon={<QuestionMark />} onClick={() => {}} className={styles.disabled} />
    </div>
  );
});
