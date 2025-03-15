import { FC, memo } from "react";
import * as styles from "./Root.styles";
import { Outlet } from "@tanstack/react-router";
import { NavBar } from "../NavBar/NavBar";

export const Root: FC = memo(() => {
  return (
    <div className={styles.root}>
      <NavBar />

      <Outlet />
    </div>
  );
});
