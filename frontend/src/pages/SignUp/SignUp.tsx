import { Button, TextField } from '@mui/material';
import { useNavigate } from '@tanstack/react-router';
import { useAtomInstance } from '@zedux/react';
import { memo } from 'react';

import { currentUserAtom } from '../../atoms/currentUser';
import { PasswordInput } from '../../components/PasswordInput/PasswordInput';
import { authFormStyles } from '../../styles/authForm.styles';
import { trpc } from '../../trpc';

export const SignUp: React.FC = memo(() => {
  const userAtomInstance = useAtomInstance(currentUserAtom);

  const navigate = useNavigate();

  return (
    <form
      className={authFormStyles}
      onSubmit={async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        try {
          await trpc.user.signUp.mutate({
            email: String(formData.get('email')),
            password: String(formData.get('password')),
            username: String(formData.get('username')),
          });
        } catch (error) {
          if (error instanceof Error) {
            alert(error.message);
          }
          return;
        }
        userAtomInstance.invalidate();
        navigate({ to: '/' });
      }}
    >
      <TextField placeholder="Email" name="email" />

      <TextField placeholder="Username" name="username" />

      <PasswordInput />

      <Button type="submit" variant="contained">
        Sign Up
      </Button>
    </form>
  );
});
