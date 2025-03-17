import { FC, memo, useEffect } from "react";
import * as styles from "./Root.styles";
import { Outlet } from "@tanstack/react-router";
import { NavBar } from "../NavBar/NavBar";
import { trpc } from "../../trpc";
import { useSetAtom } from "jotai";
import { currentUserAtom } from "../../atoms/currentUser";

export const Root: FC = memo(() => {
  const { data } = trpc.user.getMe.useQuery(undefined);
  const setCurrentUser = useSetAtom(currentUserAtom);

  useEffect(() => {
    if (data) {
      setCurrentUser({ userId: data.id, username: data.username });
    }
  }, [data]);

  return (
    <div className={styles.root}>
      <NavBar />

      <Outlet />
    </div>
  );
});
