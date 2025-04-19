import cookie from '@fastify/cookie';
import cors from '@fastify/cors';
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify';
import fastify from 'fastify';

import { createContext } from './router/context.js';
import { appRouter } from './router/index.js';
import { userService } from './router/routers/user.js';
import { sendAuthTokens } from './utils/sendAuthTokens.js';

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

server.post('/refresh_token', async (request, reply) => {
  const refreshToken = request.cookies.refreshToken;

  if (!refreshToken) {
    return reply.status(401).send({ error: 'No refresh token' });
  }

  const { valid, value } = request.unsignCookie(refreshToken);
  if (!valid) {
    return reply.status(401).send({ error: 'Invalid refresh token' });
  }

  const newTokens = await userService.refreshToken({ refreshToken: value });
  sendAuthTokens(reply, newTokens);

  return reply.status(200);
});

try {
  await server.listen({ host: '0.0.0.0', port: 3003 });
} catch (err) {
  server.log.error(err);
}
