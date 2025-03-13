import { FastifyReply } from "fastify";

export const sendAccessToken = (reply: FastifyReply, accessToken: string) => {
  reply.setCookie("accessToken", accessToken, {
    maxAge: 60 * 15,
    httpOnly: true,
    path: "/",
    signed: true,
    sameSite: "strict",
  });
};
