
import { gridGameRouter } from "./routers/gridGame.js";
import { questionRouter } from "./routers/question.js";
import { router } from "./trpc.js";

export const appRouter = router({
  question: questionRouter,
  gridGame: gridGameRouter,
});

export type AppRouter = typeof appRouter;
