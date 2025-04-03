import { createChannel, createClient } from 'nice-grpc';
import { z } from 'zod';
import { UserServiceClient, UserServiceDefinition } from '../../pb/user.js';
import { publicProcedure, router } from '../trpc.js';
import { sendRefreshToken } from '../../utils/sendRefreshToken.js';
import { sendAccessToken } from '../../utils/sendAccessToken.js';
import { TRPCError } from '@trpc/server';

const channel = createChannel(process.env.USER_SERVICE_URL ?? 'localhost:3004');
const userService: UserServiceClient = createClient(UserServiceDefinition, channel);

export const userRouter = router({
  signUp: publicProcedure
    .input(
      z.object({
        username: z.string(),
        password: z.string(),
        email: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { refreshToken, accessToken } = await userService.signUp(input);
      sendRefreshToken(ctx.res, refreshToken);
      sendAccessToken(ctx.res, accessToken);

      return {};
    }),
  signIn: publicProcedure
    .input(z.object({ username: z.string(), password: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { refreshToken, accessToken } = await userService.signIn(input);
      sendRefreshToken(ctx.res, refreshToken);
      sendAccessToken(ctx.res, accessToken);

      return {};
    }),
  changePassword: publicProcedure.input(z.object({ newPassword: z.string() })).mutation(async ({ input, ctx }) => {
    const { accessToken, refreshToken } = await userService.changePassword(input);
    sendRefreshToken(ctx.res, refreshToken);
    sendAccessToken(ctx.res, accessToken);

    return {};
  }),
  refreshToken: publicProcedure.mutation(async ({ ctx }) => {
    const refreshToken = ctx.req.cookies.refreshToken;
    if (!refreshToken) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'No refresh token',
      });
    }

    const newTokens = await userService.refreshToken({ refreshToken });
    sendRefreshToken(ctx.res, newTokens.refreshToken);
    sendAccessToken(ctx.res, newTokens.accessToken);

    return {};
  }),
  getMe: publicProcedure.query(({ ctx }) => {
    if (!ctx.req.cookies.accessToken) {
      throw new TRPCError({ code: 'UNAUTHORIZED', message: 'No access token' });
    }

    const { valid, value } = ctx.req.unsignCookie(ctx.req.cookies.accessToken);
    if (!valid) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Invalid access token',
      });
    }

    return userService.getMe({ accessToken: value });
  }),
  signOut: publicProcedure.mutation(async ({ ctx }) => {
    ctx.res.clearCookie('refreshToken');
    ctx.res.clearCookie('accessToken');

    return {};
  }),
});
