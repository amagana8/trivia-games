import { z } from "zod";
import { publicProcedure, router } from "../../router/trpc.js";
import { createChannel, createClient } from "nice-grpc";
import {
  GridGameServiceClient,
  GridGameServiceDefinition,
} from "../../pb/gridGame.js";

const channel = createChannel(process.env.GAME_SERVICE_URL ?? "localhost:3002");
const gridGameService: GridGameServiceClient = createClient(
  GridGameServiceDefinition,
  channel
);

const gridValidator = z.array(
  z.object({ category: z.string(), questions: z.array(z.string()) })
);

export const gridGameRouter = router({
  createGridGame: publicProcedure
    .input(
      z.object({
        authorId: z.string(),
        grid: gridValidator,
      })
    )
    .mutation(({ input }) => gridGameService.createGridGame(input)),
  getGridGame: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => gridGameService.getGridGame(input)),
  getAllGridGames: publicProcedure.query(() =>
    gridGameService.getAllGridGames({})
  ),
  updateGridGame: publicProcedure
    .input(
      z.object({
        grid: gridValidator,
      })
    )
    .mutation(({ input }) => gridGameService.updateGridGame(input)),
    deleteGridGame: publicProcedure.query(() => gridGameService.deleteGridGame({})),
});
