import {
  protectedProcedure,
  publicProcedure,
  router,
} from '../../router/trpc.js';
import { sendAuthTokens } from '../../utils/sendAuthTokens.js';
import { userService } from './user.service.js';
import { signUpRequestValidator } from './user.validators.js';
import { serialize } from 'cookie';

export const userRouter = router({
  changePassword: protectedProcedure
    .input(signUpRequestValidator.pick({ password: true }))
    .mutation(async ({ input, ctx }) => {
      const newTokens = await userService.changePassword({
        newPassword: input.password,
        userId: ctx.userId,
      });
      sendAuthTokens(ctx.res, newTokens);

      return;
    }),
  getMe: protectedProcedure.query(({ ctx }) =>
    userService.getMe({ userId: ctx.userId }),
  ),
  signIn: publicProcedure
    .input(signUpRequestValidator.omit({ email: true }))
    .mutation(async ({ input, ctx }) => {
      const newTokens = await userService.signIn(input);
      sendAuthTokens(ctx.res, newTokens);

      return;
    }),
  signOut: publicProcedure.mutation(async ({ ctx }) => {
    ctx.res.header(
      'set-cookie',
      serialize('refreshToken', '', { path: '/refresh_token' }),
    );
    ctx.res.header('set-cookie', serialize('accessToken', ''));

    return;
  }),
  signUp: publicProcedure
    .input(signUpRequestValidator)
    .mutation(async ({ input, ctx }) => {
      const newTokens = await userService.signUp(input);
      sendAuthTokens(ctx.res, newTokens);

      return;
    }),
});
