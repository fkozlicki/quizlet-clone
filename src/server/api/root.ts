import { createTRPCRouter } from "./trpc";
import { studySetRouter } from "./routers/study-set";
import { userRouter } from "./routers/user";
import { cardRouter } from "./routers/card";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  studySet: studySetRouter,
  user: userRouter,
  card: cardRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
