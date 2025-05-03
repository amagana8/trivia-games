import { FastifyReply } from 'fastify';

export function sendAuthTokens(
  reply: FastifyReply,
  { accessToken, refreshToken }: { accessToken: string; refreshToken: string },
) {
  reply.setCookie('accessToken', accessToken, {
    httpOnly: true,
    maxAge: 60 * 15,
    path: '/',
    sameSite: 'strict',
    signed: true,
  });

  reply.setCookie('refreshToken', refreshToken, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7,
    path: '/refresh_token',
    sameSite: 'strict',
    signed: true,
  });
}
