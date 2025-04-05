import cookie from '@fastify/cookie';
import cors from '@fastify/cors';
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify';
import fastify from 'fastify';

import { createContext } from './router/context.js';
import { appRouter } from './router/index.js';

const server = fastify({ logger: true });

server.register(cors, {
  credentials: true,
  origin: 'http://localhost:5173',
});

server.register(cookie, {
  secret: process.env.COOKIE_KEY,
});

server.register(fastifyTRPCPlugin, {
  prefix: '/trpc',
  trpcOptions: { createContext, router: appRouter },
});

try {
  await server.listen({ host: '0.0.0.0', port: 3003 });
} catch (err) {
  server.log.error(err);
}
