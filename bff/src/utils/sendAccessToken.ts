import { FastifyReply } from 'fastify';

export const sendAccessToken = (reply: FastifyReply, accessToken: string) => {
  reply.setCookie('accessToken', accessToken, {
    httpOnly: true,
    maxAge: 60 * 15,
    path: '/',
    sameSite: 'strict',
    signed: true,
  });
};
