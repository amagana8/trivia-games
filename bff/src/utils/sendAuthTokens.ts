import { FastifyReply } from 'fastify';
import { serialize } from 'cookie';

export function sendAuthTokens(
  reply: FastifyReply,
  { accessToken, refreshToken }: { accessToken: string; refreshToken: string },
) {
  reply.header(
    'set-cookie',
    serialize('accessToken', accessToken, {
      httpOnly: true,
      maxAge: 60 * 15,
      path: '/',
      sameSite: 'strict',
    }),
  );

  reply.header(
    'set-cookie',
    serialize('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7,
      path: '/refresh_token',
      sameSite: 'strict',
    }),
  );
}
