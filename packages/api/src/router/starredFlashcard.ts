import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import {
  createStarredFlashcard,
  deleteStarredFlashcard,
} from "@acme/db/mutations";

import { protectedProcedure } from "../trpc";

export const starredFlashcardRouter = {
  create: protectedProcedure
    .input(z.object({ flashcardId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      return await createStarredFlashcard(ctx.db, {
        flashcardId: input.flashcardId,
        userId: ctx.session.user.id,
      });
    }),
  delete: protectedProcedure
    .input(z.object({ flashcardId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      return await deleteStarredFlashcard(ctx.db, {
        flashcardId: input.flashcardId,
        userId: ctx.session.user.id,
      });
    }),
} satisfies TRPCRouterRecord;
