import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';
import type { Context } from './context.js';

const t = initTRPC.context<Context>().create({ transformer: superjson });

export const router = t.router;
export const publicProcedure = t.procedure;

export const protectedProcedure = publicProcedure.use(async (opts) => {
  try {
    const { sub } = await opts.ctx.req.jwtVerify<{ sub: string }>();
    opts.ctx.userId = sub;
    return opts.next(opts);
  } catch {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
    });
  }
});
