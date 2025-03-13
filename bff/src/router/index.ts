
import { gridGameRouter } from "./routers/gridGame.js";
import { questionRouter } from "./routers/question.js";
import { userRouter } from "./routers/user.js";
import { router } from "./trpc.js";

export const appRouter = router({
  question: questionRouter,
  gridGame: gridGameRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;
