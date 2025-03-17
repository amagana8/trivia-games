import { AccountCircle } from "@mui/icons-material";
import {
  Button,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Typography,
} from "@mui/material";
import { FC, memo, useCallback, useRef, useState } from "react";
import * as styles from "./NavBar.styles";
import { useAtom } from "jotai";
import { currentUserAtom } from "../../atoms/currentUser";
import { useNavigate } from "@tanstack/react-router";
import { trpc } from "../../trpc";

export const NavBar: FC = memo(() => {
  const accountButtonRef = useRef<HTMLButtonElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const openMenu = useCallback(() => {
    setMenuOpen(true);
  }, []);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
  }, []);

  const [currentUser, setCurrentUser] = useAtom(currentUserAtom);

  const navigate = useNavigate();

  const signOut = trpc.user.signOut.useMutation({
    onSuccess: () => {
      setCurrentUser(null);
      navigate({ to: "/" });
    },
  });
  const handleLogout = useCallback(() => {
    signOut.mutate();
    closeMenu();
  }, []);

  return (
    <>
      <Paper className={styles.navBar}>
        <Typography variant="h6" className={styles.title}>
          Trivia Games
        </Typography>

        {currentUser ? (
          <IconButton ref={accountButtonRef} onClick={openMenu}>
            <AccountCircle />
          </IconButton>
        ) : (
          <div>
            <Button onClick={() => navigate({ to: "/login" })}>Login</Button>

            <Button
              variant="contained"
              onClick={() =>
                navigate({
                  to: "/sign-up",
                })
              }
            >
              Sign Up
            </Button>
          </div>
        )}
      </Paper>

      <Menu
        anchorEl={accountButtonRef.current}
        open={menuOpen}
        onClose={closeMenu}
      >
        <MenuItem>Profile</MenuItem>

        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </>
  );
});
