import { z } from 'zod';

export const userValidator = z.object({
  email: z.string(),
  games: z.array(z.string()),
  questions: z.array(z.string()),
  userId: z.string(),
  username: z.string(),
});

export const signUpRequestValidator = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(256),
  username: z.string().min(4).max(28),
});
