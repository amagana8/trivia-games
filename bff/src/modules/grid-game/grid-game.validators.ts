import { z } from 'zod';

export const gridGameValidator = z.object({
  authorId: z.string(),
  createdAt: z.string(),
  grid: z.array(z.object({ category: z.string(), questions: z.array(z.string()) })),
  gridGameId: z.string(),
  title: z.string(),
  updatedAt: z.string(),
});

export const gridGameInputValidator = gridGameValidator.omit({
  authorId: true,
  createdAt: true,
  gridGameId: true,
  updatedAt: true,
});
