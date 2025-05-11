import { gameRoomRouter } from '../modules/game-room/game-room.router.js';
import { gridGameRouter } from '../modules/grid-game/grid-game.router.js';
import { questionRouter } from '../modules/question/question.router.js';
import { userRouter } from '../modules/user/user.router.js';
import { router } from './trpc.js';

export const appRouter = router({
  gridGame: gridGameRouter,
  question: questionRouter,
  user: userRouter,
  gameRoom: gameRoomRouter,
});

export type AppRouter = typeof appRouter;
