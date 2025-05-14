import { z } from 'zod';

export const joinGameRoomRequestValidator = z.object({
  gameRoomId: z.string(),
});

export const startGameRequestValidator = z.object({
  hostId: z.string(),
  gameRoomId: z.string(),
  gameId: z.string(),
});

export const selectQuestionRequestValidator = z.object({
  userId: z.string(),
  gameRoomId: z.string(),
  questionId: z.string(),
});

export const startBuzzerRequestValidator = z.object({
  hostId: z.string(),
  gameRoomId: z.string(),
});

export const judgeAnswerRequestValidator = z.object({
  gameRoomId: z.string(),
  hostId: z.string(),
  playerId: z.string(),
  isCorrect: z.boolean(),
});
