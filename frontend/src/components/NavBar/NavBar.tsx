import { AccountCircle } from '@mui/icons-material';
import { Button, ButtonBase, IconButton, Menu, MenuItem, Paper, Typography } from '@mui/material';
import { useNavigate } from '@tanstack/react-router';
import { useAtom } from 'jotai';
import { FC, memo, Suspense, useCallback, useRef, useState } from 'react';

import { currentUserAtom } from '../../atoms/currentUser';
import { trpc } from '../../trpc';
import * as styles from './NavBar.styles';

export const NavBar: FC = memo(() => {
  const accountButtonRef = useRef<HTMLButtonElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const openMenu = useCallback(() => {
    setMenuOpen(true);
  }, []);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
  }, []);

  const [currentUser, refreshCurrentUser] = useAtom(currentUserAtom);

  const navigate = useNavigate();

  const handleLogout = useCallback(async () => {
    await trpc.user.signOut.mutate();
    refreshCurrentUser();
    navigate({ to: '/' });
    closeMenu();
  }, []);

  return (
    <>
      <Paper className={styles.navBar}>
        <ButtonBase onClick={() => navigate({ to: '/' })} className={styles.logo}>
          <Typography variant="h6">Trivia Games</Typography>
        </ButtonBase>

        <div className={styles.buttons}>
          {currentUser ? (
            <Suspense fallback={<div>Loading...</div>}>
              <IconButton ref={accountButtonRef} onClick={openMenu}>
                <AccountCircle />
              </IconButton>
            </Suspense>
          ) : (
            <>
              <Button onClick={() => navigate({ to: '/login' })}>Login</Button>

              <Button
                variant="contained"
                onClick={() =>
                  navigate({
                    to: '/sign-up',
                  })
                }
              >
                Sign Up
              </Button>
            </>
          )}
        </div>
      </Paper>

      <Menu anchorEl={accountButtonRef.current} open={menuOpen} onClose={closeMenu}>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </>
  );
});
