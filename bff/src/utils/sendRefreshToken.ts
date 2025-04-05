import { FastifyReply } from 'fastify';

export const sendRefreshToken = (reply: FastifyReply, refreshToken: string) => {
  reply.setCookie('refreshToken', refreshToken, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7,
    path: '/trpc/user.refreshToken',
    sameSite: 'strict',
    signed: true,
  });
};
