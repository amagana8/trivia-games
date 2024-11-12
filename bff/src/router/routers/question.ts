import { z } from "zod";
import { publicProcedure, router } from "../../router/trpc.js";
import { createChannel, createClient } from "nice-grpc";
import {
  QuestionServiceClient,
  QuestionServiceDefinition,
} from "../../pb/question.js";

const channel = createChannel(process.env.QUESTION_SERVICE_URL ?? "localhost:3001");
const questionService: QuestionServiceClient = createClient(
  QuestionServiceDefinition,
  channel
);

export const questionRouter = router({
  createQuestion: publicProcedure
    .input(
      z.object({ authorId: z.string(), query: z.string(), answer: z.string() })
    )
    .mutation(({ input }) => questionService.createQuestion(input)),
  getQuestion: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => questionService.getQuestion(input)),
  getAllQuestions: publicProcedure.query(() =>
    questionService.getAllQuestions({})
  ),
  updateQuestion: publicProcedure
    .input(z.object({ query: z.string(), answer: z.string() }))
    .mutation(({ input }) => questionService.updateQuestion(input)),
  deleteQuestion: publicProcedure.query(() =>
    questionService.deleteQuestion({})
  ),
});
