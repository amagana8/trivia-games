import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";
import fastify from "fastify";
import { appRouter } from "./router/index.js";
import { createContext } from "./router/context.js";

const server = fastify({ logger: true });

server.register(fastifyTRPCPlugin, {
  prefix: "/trpc",
  trpcOptions: { router: appRouter, createContext },
});

try {
  await server.listen({ port: 3003, host: "0.0.0.0" });
} catch (err) {
  server.log.error(err);
}
