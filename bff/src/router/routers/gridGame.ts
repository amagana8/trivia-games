import { createChannel, createClient } from 'nice-grpc';
import { z } from 'zod';

import { GridGameServiceClient, GridGameServiceDefinition } from '../../pb/gridGame.js';
import { publicProcedure, router } from '../../router/trpc.js';

const channel = createChannel(process.env.GAME_SERVICE_URL ?? 'localhost:3002');
const gridGameService: GridGameServiceClient = createClient(GridGameServiceDefinition, channel);

const gridValidator = z.array(z.object({ category: z.string(), questions: z.array(z.string()) }));

export const gridGameRouter = router({
  createGridGame: publicProcedure
    .input(
      z.object({
        authorId: z.string(),
        grid: gridValidator,
        title: z.string(),
      })
    )
    .mutation(({ input }) => gridGameService.createGridGame(input)),
  deleteGridGame: publicProcedure.query(() => gridGameService.deleteGridGame({})),
  getAllGridGames: publicProcedure.query(() => gridGameService.getAllGridGames({})),
  getGridGame: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => gridGameService.getGridGame(input)),
  updateGridGame: publicProcedure
    .input(
      z.object({
        grid: gridValidator,
        id: z.string(),
        title: z.string(),
      })
    )
    .mutation(({ input }) => gridGameService.updateGridGame(input)),
});
