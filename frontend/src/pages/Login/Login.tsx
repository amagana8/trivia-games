import { Button, TextField } from '@mui/material';
import { useNavigate } from '@tanstack/react-router';
import { useSetAtom } from 'jotai';
import React, { memo, useCallback } from 'react';

import { currentUserAtom } from '../../atoms/currentUser';
import { PasswordInput } from '../../components/PasswordInput/PasswordInput';
import { authFormStyles } from '../../styles/authForm.styles';
import { trpc } from '../../trpc';

export const Login: React.FC = memo(() => {
  const refreshCurrentUser = useSetAtom(currentUserAtom);
  const navigate = useNavigate();

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      await trpc.user.signIn.mutate({
        password: String(formData.get('password')),
        username: String(formData.get('username')),
      });

      refreshCurrentUser();
      navigate({ to: '/' });
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    }
  }, []);

  return (
    <form className={authFormStyles} onSubmit={handleSubmit}>
      <TextField placeholder="Username" name="username" />

      <PasswordInput />

      <Button type="submit" variant="contained">
        Login
      </Button>
    </form>
  );
});
