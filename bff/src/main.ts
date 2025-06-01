import cookie from '@fastify/cookie';
import cors from '@fastify/cors';
import fastifyEnv from '@fastify/env';
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify';
import fastify from 'fastify';

import { userService } from './modules/user/user.service.js';
import { createContext } from './router/context.js';
import { appRouter } from './router/index.js';
import { sendAuthTokens } from './utils/sendAuthTokens.js';
import ws from '@fastify/websocket';

declare module 'fastify' {
  interface FastifyInstance {
    config: {
      COOKIE_KEY: string;
      JWT_PUBLIC_KEY: string;
    };
  }
}

const server = fastify({ logger: true });

await server.register(fastifyEnv, {
  schema: {
    properties: {
      COOKIE_KEY: { type: 'string' },
      JWT_PUBLIC_KEY: { type: 'string' },
    },
    required: ['JWT_PUBLIC_KEY', 'COOKIE_KEY'],
    type: 'object',
  },
});

server.register(cors, {
  credentials: true,
  origin: 'http://localhost:5173',
});

server.register(cookie, {
  secret: server.config.COOKIE_KEY,
});

server.register(ws);

server.register(fastifyTRPCPlugin, {
  prefix: '/trpc',
  useWSS: true,
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

  return reply.status(200).send();
});

try {
  await server.listen({ host: '0.0.0.0', port: 3003 });
} catch (err) {
  server.log.error(err);
}
