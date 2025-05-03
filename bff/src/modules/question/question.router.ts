import { Question } from '../../pb/question.js';
import {
  protectedProcedure,
  publicProcedure,
  router,
} from '../../router/trpc.js';
import { userService } from '../user/user.service.js';
import { questionService } from './question.service.js';
import {
  questionInputValidator,
  questionValidator,
} from './question.validators.js';

export const questionRouter = router({
  createQuestion: protectedProcedure
    .input(questionInputValidator)
    .mutation(({ input, ctx }) =>
      questionService.createQuestion({ ...input, authorId: ctx.userId }),
    ),
  deleteQuestion: protectedProcedure
    .input(questionValidator.pick({ questionId: true }))
    .query(({ ctx, input: { questionId } }) =>
      questionService.deleteQuestion({ authorId: ctx.userId, questionId }),
    ),
  getAllQuestions: publicProcedure.query(async () => {
    const res = await questionService.getAllQuestions({});
    const questionMap = res.questions.reduce(
      (acc: Record<string, Question>, question) => {
        acc[question.questionId] = question;
        return acc;
      },
      {},
    );
    return { questionMap };
  }),
  getMyQuestions: protectedProcedure.query(async ({ ctx }) => {
    const { questions } = await userService.getMe({ userId: ctx.userId });

    const res = await questionService.getQuestions({ questionIds: questions });
    const questionMap = res.questions.reduce(
      (acc: Record<string, Question>, question) => {
        acc[question.questionId] = question;
        return acc;
      },
      {},
    );
    return { questionMap };
  }),
  getQuestion: publicProcedure
    .input(questionValidator.pick({ questionId: true }))
    .query(({ input }) => questionService.getQuestion(input)),
  updateQuestion: protectedProcedure
    .input(questionInputValidator)
    .mutation(({ input, ctx }) =>
      questionService.updateQuestion({ ...input, authorId: ctx.userId }),
    ),
});
