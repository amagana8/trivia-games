import { Button, TextField } from '@mui/material';
import { memo, useCallback } from 'react';
import { PasswordInput } from '../PasswordInput/PasswordInput';
import * as styles from '../AuthPage.styles';
import { useSetAtom } from 'jotai';
import { currentUserAtom } from '../../../atoms/currentUser';
import { useNavigate } from '@tanstack/react-router';
import { trpc } from '../../../trpc';

export const LoginPage = memo(() => {
  const refreshCurrentUser = useSetAtom(currentUserAtom);
  const navigate = useNavigate();

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      await trpc.user.signIn.mutate({
        username: String(formData.get('username')),
        password: String(formData.get('password')),
      });
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
      return;
    }

    refreshCurrentUser();
    navigate({ to: '/' });
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
