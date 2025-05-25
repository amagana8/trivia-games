import {
  protectedProcedure,
  publicProcedure,
  router,
} from '../../router/trpc.js';
import { gridGameService } from './grid-game.service.js';
import {
  gridGameInputValidator,
  gridGameValidator,
} from './grid-game.validators.js';

export const gridGameRouter = router({
  createGridGame: protectedProcedure.mutation(({ ctx }) =>
    gridGameService.createGridGame({ authorId: ctx.userId }),
  ),
  deleteGridGame: protectedProcedure
    .input(gridGameValidator.pick({ gridGameId: true }))
    .query(({ input: { gridGameId }, ctx }) =>
      gridGameService.deleteGridGame({ authorId: ctx.userId, gridGameId }),
    ),
  getGridGame: publicProcedure
    .input(gridGameValidator.pick({ gridGameId: true }))
    .query(({ input }) => gridGameService.getGridGame(input)),
  getMyGridGames: protectedProcedure.query(({ ctx }) =>
    gridGameService.getGridGamesByAuthorId({ authorId: ctx.userId }),
  ),
  updateGridGame: protectedProcedure
    .input(gridGameInputValidator)
    .mutation(({ input, ctx }) =>
      gridGameService.updateGridGame({ ...input, authorId: ctx.userId }),
    ),
});
