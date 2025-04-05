import { Outlet } from '@tanstack/react-router';
import { FC, memo } from 'react';

import { NavBar } from '../NavBar/NavBar';
import * as styles from './Root.styles';

export const Root: FC = memo(() => {
  return (
    <div className={styles.root}>
      <NavBar />

      <Outlet />
    </div>
  );
});
