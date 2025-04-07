import { Outlet } from '@tanstack/react-router';
import { memo } from 'react';

import { NavBar } from '../../components/NavBar/NavBar';
import * as styles from './Root.styles';

export const Root: React.FC = memo(() => {
  return (
    <div className={styles.root}>
      <NavBar />

      <Outlet />
    </div>
  );
});
