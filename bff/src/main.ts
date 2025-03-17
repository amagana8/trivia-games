import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";
import fastify from "fastify";
import { appRouter } from "./router/index.js";
import { createContext } from "./router/context.js";
import cors from "@fastify/cors";
import cookie from "@fastify/cookie";

const server = fastify({ logger: true });

server.register(cors, {
  origin: "http://localhost:5173",
  credentials: true,
});

server.register(cookie, {
  secret: process.env.COOKIE_KEY,
});

server.register(fastifyTRPCPlugin, {
  prefix: "/trpc",
  trpcOptions: { router: appRouter, createContext },
});

try {
  await server.listen({ port: 3003, host: "0.0.0.0" });
} catch (err) {
  server.log.error(err);
}
