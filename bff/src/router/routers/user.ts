import { TRPCError } from '@trpc/server';
import { createChannel, createClient } from 'nice-grpc';
import { z } from 'zod';

import { UserServiceClient, UserServiceDefinition } from '../../pb/user.js';
import { sendAuthTokens } from '../../utils/sendAuthTokens.js';
import { publicProcedure, router } from '../trpc.js';

const channel = createChannel(process.env.USER_SERVICE_URL ?? 'localhost:3004');
export const userService: UserServiceClient = createClient(UserServiceDefinition, channel);

export const userRouter = router({
  changePassword: publicProcedure.input(z.object({ newPassword: z.string() })).mutation(async ({ input, ctx }) => {
    const newTokens = await userService.changePassword(input);
    sendAuthTokens(ctx.res, newTokens);

    return;
  }),
  getMe: publicProcedure.query(({ ctx }) => {
    const accessToken = ctx.req.cookies.accessToken;

    if (!accessToken) {
      throw new TRPCError({ code: 'UNAUTHORIZED', message: 'No access token' });
    }

    const { valid, value } = ctx.req.unsignCookie(accessToken);
    if (!valid) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Invalid access token',
      });
    }

    return userService.getMe({ accessToken: value });
  }),
  signIn: publicProcedure
    .input(z.object({ password: z.string(), username: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const newTokens = await userService.signIn(input);
      sendAuthTokens(ctx.res, newTokens);

      return;
    }),
  signOut: publicProcedure.mutation(async ({ ctx }) => {
    ctx.res.clearCookie('refreshToken', { path: '/refresh_token' });
    ctx.res.clearCookie('accessToken');

    return;
  }),
  signUp: publicProcedure
    .input(
      z.object({
        email: z.string(),
        password: z.string(),
        username: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const newTokens = await userService.signUp(input);
      sendAuthTokens(ctx.res, newTokens);

      return;
    }),
});
