import { AccountCircle } from '@mui/icons-material';
import {
  Button,
  ButtonBase,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Typography,
} from '@mui/material';
import { useNavigate } from '@tanstack/react-router';
import { useAtomInstance, useAtomValue } from '@zedux/react';
import { memo, Suspense, useRef, useState } from 'react';

import { currentUserAtom } from '../../atoms/currentUser';
import { trpc } from '../../trpc';
import * as styles from './NavBar.styles';

export const NavBar: React.FC = memo(() => {
  const accountButtonRef = useRef<HTMLButtonElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const currentUser = useAtomValue(currentUserAtom);
  const { invalidate: resetCurrentUser } = useAtomInstance(currentUserAtom);

  const navigate = useNavigate();

  return (
    <>
      <Paper className={styles.navBar}>
        <ButtonBase
          onClick={() => navigate({ to: '/' })}
          className={styles.logo}
        >
          <Typography variant="h6">Trivia Games</Typography>
        </ButtonBase>

        <div className={styles.buttons}>
          {currentUser ? (
            <Suspense fallback={<div>Loading...</div>}>
              <IconButton
                ref={accountButtonRef}
                onClick={() => setMenuOpen(true)}
              >
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

      <Menu
        anchorEl={accountButtonRef.current}
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
      >
        <MenuItem
          onClick={async () => {
            await trpc.user.signOut.mutate();
            resetCurrentUser();
            navigate({ to: '/' });
            setMenuOpen(false);
          }}
        >
          Logout
        </MenuItem>
      </Menu>
    </>
  );
});
