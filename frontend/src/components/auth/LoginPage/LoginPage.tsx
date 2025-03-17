import { Button, TextField } from "@mui/material";
import { memo, useCallback } from "react";
import { PasswordInput } from "../PasswordInput/PasswordInput";
import * as styles from "../AuthPage.styles";
import { useSetAtom } from "jotai";
import { currentUserAtom } from "../../../atoms/currentUser";
import { useNavigate } from "@tanstack/react-router";
import { trpc } from "../../../trpc";

export const LoginPage = memo(() => {
  const setCurrentUser = useSetAtom(currentUserAtom);
  const navigate = useNavigate();

  const getMe = trpc.user.getMe.useQuery(undefined, { enabled: false });
  const signIn = trpc.user.signIn.useMutation({
    onError: (error) => alert(error.message),
  });

  const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    signIn.mutate(
      {
        username: String(formData.get("username")),
        password: String(formData.get("password")),
      },
      {
        onSuccess: async () => {
          const { data } = await getMe.refetch();
          if (!data) return;

          setCurrentUser({
            userId: data.id,
            username: data.username,
          });

          navigate({ to: "/" });
        },
      }
    );
  }, []);

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <TextField placeholder="Username" name="username" />

      <PasswordInput />

      <Button type="submit" variant="contained">
        Login
      </Button>
    </form>
  );
});
