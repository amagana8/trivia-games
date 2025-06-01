import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';
import type { Context } from './context.js';
import { verifyJwt } from '../utils/verifyJwt.js';
import { parse } from 'cookie';

const t = initTRPC.context<Context>().create({ transformer: superjson });

export const router = t.router;
export const publicProcedure = t.procedure;

export const protectedProcedure = publicProcedure.use(async (opts) => {
  try {
    const { accessToken } = parse(opts.ctx.req.headers.cookie ?? '');
    if (!accessToken) {
      throw new Error('No access token cookie in request');
    }

    const { sub } = verifyJwt(accessToken);
    opts.ctx.userId = sub;

    return opts.next(opts);
  } catch (e) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      cause: e,
    });
  }
});
