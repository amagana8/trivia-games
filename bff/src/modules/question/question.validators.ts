import { z } from 'zod';

import { MediaType } from '../../pb/question.js';

export const questionValidator = z.object({
  answer: z.string(),
  authorId: z.string(),
  createdAt: z.string(),
  embed: z
    .object({
      type: z.nativeEnum(MediaType),
      url: z.string(),
    })
    .optional(),
  query: z.string(),
  questionId: z.string(),
  updatedAt: z.string(),
});

export const questionInputValidator = questionValidator.omit({
  authorId: true,
  createdAt: true,
  questionId: true,
  updatedAt: true,
});
