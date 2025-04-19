import { createChannel, createClient } from 'nice-grpc';
import { z } from 'zod';

import { GridGameServiceClient, GridGameServiceDefinition } from '../../pb/gridGame.js';
import { protectedProcedure, publicProcedure, router } from '../../router/trpc.js';

const channel = createChannel(process.env.GAME_SERVICE_URL ?? 'localhost:3002');
const gridGameService: GridGameServiceClient = createClient(GridGameServiceDefinition, channel);

const gridValidator = z.array(z.object({ category: z.string(), questions: z.array(z.string()) }));

export const gridGameRouter = router({
  createGridGame: protectedProcedure
    .input(
      z.object({
        grid: gridValidator,
        title: z.string(),
      })
    )
    .mutation(({ input, ctx }) => gridGameService.createGridGame({ ...input, authorId: ctx.userId })),
  deleteGridGame: protectedProcedure
    .input(z.object({ gridGameId: z.string() }))
    .query(({ input: { gridGameId }, ctx }) => gridGameService.deleteGridGame({ gridGameId, userId: ctx.userId })),
  getAllGridGames: publicProcedure.query(() => gridGameService.getAllGridGames({})),
  getGridGame: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => gridGameService.getGridGame(input)),
  updateGridGame: protectedProcedure
    .input(
      z.object({
        grid: gridValidator,
        id: z.string(),
        title: z.string(),
      })
    )
    .mutation(({ input, ctx }) => gridGameService.updateGridGame({ ...input, userId: ctx.userId })),
});
