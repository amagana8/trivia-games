import { Button, TextField } from "@mui/material";
import { useNavigate } from "@tanstack/react-router";
import { useSetAtom } from "jotai";
import { FC, memo, useCallback } from "react";
import { currentUserAtom } from "../../../atoms/currentUser";
import { trpc } from "../../../trpc";
import { PasswordInput } from "../PasswordInput/PasswordInput";
import * as styles from "../AuthPage.styles";

export const SignUpPage: FC = memo(() => {
  const refreshCurrentUser = useSetAtom(currentUserAtom);

  const navigate = useNavigate();

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);

      try {
        await trpc.user.signUp.mutate({
          username: String(formData.get("username")),
          email: String(formData.get("email")),
          password: String(formData.get("password")),
        });
      } catch (error) {
        if (error instanceof Error) {
          alert(error.message);
        }
        return;
      }
      refreshCurrentUser();
      navigate({ to: "/" });
    },
    []
  );

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
