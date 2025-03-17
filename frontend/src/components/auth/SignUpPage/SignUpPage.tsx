import { Button, TextField } from "@mui/material";
import { useNavigate } from "@tanstack/react-router";
import { useSetAtom } from "jotai";
import { FC, memo, useCallback } from "react";
import { currentUserAtom } from "../../../atoms/currentUser";
import { trpc } from "../../../trpc";
import { PasswordInput } from "../PasswordInput/PasswordInput";
import * as styles from "../AuthPage.styles";

export const SignUpPage: FC = memo(() => {
  const signUp = trpc.user.signUp.useMutation({
    onError: (error) => alert(error.message),
  });
  const getMe = trpc.user.getMe.useQuery(undefined, { enabled: false });
  const setCurrentUser = useSetAtom(currentUserAtom);

  const navigate = useNavigate();

  const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    signUp.mutate(
      {
        username: String(formData.get("username")),
        email: String(formData.get("email")),
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
      <TextField placeholder="Email" name="email" />

      <TextField placeholder="Username" name="username" />

      <PasswordInput />

      <Button type="submit" variant="contained">
        Sign Up
      </Button>
    </form>
  );
});
