import { z } from "zod";
import { publicProcedure, router } from "../../router/trpc.js";
import { createChannel, createClient } from "nice-grpc";
import {
  MediaType,
  Question,
  QuestionServiceClient,
  QuestionServiceDefinition,
} from "../../pb/question.js";

const channel = createChannel(
  process.env.QUESTION_SERVICE_URL ?? "localhost:3001"
);
const questionService: QuestionServiceClient = createClient(
  QuestionServiceDefinition,
  channel
);

export const questionRouter = router({
  createQuestion: publicProcedure
    .input(
      z.object({
        authorId: z.string(),
        query: z.string(),
        answer: z.string(),
        embed: z.object({ url: z.string(), type: z.nativeEnum(MediaType) }),
      })
    )
    .mutation(({ input }) => questionService.createQuestion(input)),
  getQuestion: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => questionService.getQuestion(input)),
  getAllQuestions: publicProcedure.query(async () => {
    try {
      const res = await questionService.getAllQuestions({});
      const questionMap = res.questions.reduce(
        (acc: Record<string, Question>, question) => {
          acc[question.id] = question;
          return acc;
        },
        {}
      );
      return { questionMap };
    } catch (error) {
      throw error;
    }
  }),
  updateQuestion: publicProcedure
    .input(
      z.object({
        query: z.string(),
        answer: z.string(),
        embed: z.object({ url: z.string(), type: z.nativeEnum(MediaType) }),
      })
    )
    .mutation(({ input }) => questionService.updateQuestion(input)),
  deleteQuestion: publicProcedure.query(() =>
    questionService.deleteQuestion({})
  ),
});
