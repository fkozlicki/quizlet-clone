import { createTRPCRouter } from "@/server/api/trpc";
import { studySetRouter } from "./routers/study-set";
import { userRouter } from "./routers/user";
import { cardRouter } from "./routers/card";
import { folderRouter } from "./routers/folder";
import { activityRouter } from "./routers/activity";
import { starredFlashcardRouter } from "./routers/starred-flashcard";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  studySet: studySetRouter,
  user: userRouter,
  card: cardRouter,
  folder: folderRouter,
  activity: activityRouter,
  starredFlashcard: starredFlashcardRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
