import { createChannel, createClient } from 'nice-grpc';
import { z } from 'zod';

import { MediaType, Question, QuestionServiceClient, QuestionServiceDefinition } from '../../pb/question.js';
import { protectedProcedure, publicProcedure, router } from '../../router/trpc.js';

const channel = createChannel(process.env.QUESTION_SERVICE_URL ?? 'localhost:3001');
const questionService: QuestionServiceClient = createClient(QuestionServiceDefinition, channel);

export const questionRouter = router({
  createQuestion: protectedProcedure
    .input(
      z.object({
        answer: z.string(),
        embed: z.object({ type: z.nativeEnum(MediaType), url: z.string() }),
        query: z.string(),
      })
    )
    .mutation(({ input, ctx }) => questionService.createQuestion({ ...input, authorId: ctx.userId })),
  deleteQuestion: protectedProcedure
    .input(z.object({ questionId: z.string() }))
    .query(({ ctx, input: { questionId } }) => questionService.deleteQuestion({ questionId, userId: ctx.userId })),
  getAllQuestions: publicProcedure.query(async () => {
    const res = await questionService.getAllQuestions({});
    const questionMap = res.questions.reduce((acc: Record<string, Question>, question) => {
      acc[question.id] = question;
      return acc;
    }, {});
    return { questionMap };
  }),
  getQuestion: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => questionService.getQuestion(input)),
  updateQuestion: protectedProcedure
    .input(
      z.object({
        answer: z.string(),
        embed: z.object({ type: z.nativeEnum(MediaType), url: z.string() }),
        query: z.string(),
      })
    )
    .mutation(({ input, ctx }) => questionService.updateQuestion({ ...input, userId: ctx.userId })),
});
