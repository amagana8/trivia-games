import cors from '@fastify/cors';
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify';
import fastify from 'fastify';
import { parse } from 'cookie';
import { userService } from './modules/user/user.service.js';
import { createContext } from './router/context.js';
import { appRouter } from './router/index.js';
import { sendAuthTokens } from './utils/sendAuthTokens.js';
import ws from '@fastify/websocket';

const server = fastify({ logger: true });

server.register(cors, {
  credentials: true,
  origin: 'http://localhost:5173',
});

server.register(ws);

server.register(fastifyTRPCPlugin, {
  prefix: '/trpc',
  useWSS: true,
  trpcOptions: { createContext, router: appRouter },
});

server.post('/refresh_token', async (request, reply) => {
  const { refreshToken } = parse(request.headers.cookie ?? '');
  if (!refreshToken) {
    return reply
      .status(401)
      .send({ error: 'No refresh token cookie in request' });
  }

  const newTokens = await userService.refreshToken({ refreshToken });
  sendAuthTokens(reply, newTokens);

  return reply.status(200).send();
});

try {
  await server.listen({ host: '0.0.0.0', port: 3003 });
} catch (err) {
  server.log.error(err);
}
