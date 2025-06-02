import { protectedProcedure, router } from '../../router/trpc.js';
import { gridGameService } from '../grid-game/grid-game.service.js';
import { gameRoomService } from './game-room.service.js';
import {
  joinGameRoomRequestValidator,
  judgeAnswerRequestValidator,
  selectQuestionRequestValidator,
  startBuzzerRequestValidator,
  startGameRequestValidator,
} from './game-room.validators.js';

export const gameRoomRouter = router({
  createGameRoom: protectedProcedure.mutation(({ ctx, signal }) =>
    gameRoomService.createGameRoom({ hostId: ctx.userId }, { signal }),
  ),
  joinGameRoom: protectedProcedure
    .input(joinGameRoomRequestValidator)
    .subscription(({ ctx, input, signal }) =>
      gameRoomService.joinGameRoom(
        {
          userId: ctx.userId,
          gameRoomId: input.gameRoomId,
        },
        { signal },
      ),
    ),
  startGame: protectedProcedure
    .input(startGameRequestValidator)
    .mutation(async ({ ctx, input, signal }) => {
      const game = await gridGameService.getGridGame({
        gridGameId: input.gameId,
      });

      const questionMap: Record<string, number> = {};
      game.grid.forEach((column) =>
        column.questions.forEach(
          (question, i) => (questionMap[question] = i * 100),
        ),
      );

      return gameRoomService.startGame(
        {
          hostId: ctx.userId,
          gameRoomId: input.gameRoomId,
          gameId: input.gameId,
          questionMap,
        },
        { signal },
      );
    }),
  selectQuestion: protectedProcedure
    .input(selectQuestionRequestValidator)
    .mutation(({ ctx, input, signal }) =>
      gameRoomService.selectQuestion(
        {
          hostId: ctx.userId,
          gameRoomId: input.gameRoomId,
          questionId: input.questionId,
        },
        { signal },
      ),
    ),
  startBuzzer: protectedProcedure
    .input(startBuzzerRequestValidator)
    .mutation(({ ctx, input, signal }) =>
      gameRoomService.startBuzzer(
        {
          hostId: ctx.userId,
          gameRoomId: input.gameRoomId,
        },
        { signal },
      ),
    ),
  judgeAnswer: protectedProcedure
    .input(judgeAnswerRequestValidator)
    .mutation(({ ctx, input, signal }) =>
      gameRoomService.judgeAnswer(
        {
          hostId: ctx.userId,
          gameRoomId: input.gameRoomId,
          playerId: input.playerId,
          isCorrect: input.isCorrect,
        },
        { signal },
      ),
    ),
});
