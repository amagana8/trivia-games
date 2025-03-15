import { AccountCircle } from "@mui/icons-material";
import { IconButton, Menu, MenuItem, Paper, Typography } from "@mui/material";
import { FC, memo, useCallback, useRef, useState } from "react";
import * as styles from "./NavBar.styles";

export const NavBar: FC = memo(() => {
  const accountButtonRef = useRef<HTMLButtonElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const openMenu = useCallback(() => {
    setMenuOpen(true);
  }, []);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
  }, []);

  return (
    <>
      <Paper className={styles.navBar}>
        <Typography variant="h6" className={styles.title}>
          Trivia Games
        </Typography>

        <IconButton ref={accountButtonRef} onClick={openMenu}>
          <AccountCircle />
        </IconButton>
      </Paper>

      <Menu
        anchorEl={accountButtonRef.current}
        open={menuOpen}
        onClose={closeMenu}
      >
        <MenuItem>Profile</MenuItem>

        <MenuItem>Logout</MenuItem>
      </Menu>
    </>
  );
});
