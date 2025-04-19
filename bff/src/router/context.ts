import { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify';

export function createContext({ req, res }: CreateFastifyContextOptions) {
  return { req, res, userId: '' };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
