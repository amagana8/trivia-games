import { FastifyReply } from 'fastify';

export const sendRefreshToken = (reply: FastifyReply, refreshToken: string) => {
  reply.setCookie('refreshToken', refreshToken, {
    maxAge: 60 * 60 * 24 * 7,
    httpOnly: true,
    path: '/trpc/user.refreshToken',
    signed: true,
    sameSite: 'strict',
  });
};
