import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { and, eq } from "@acme/db";
import { StarredFlashcard } from "@acme/db/schema";

import { protectedProcedure } from "../trpc";

export const starredFlashcardRouter = {
  create: protectedProcedure
    .input(z.object({ flashcardId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      return await ctx.db
        .insert(StarredFlashcard)
        .values({
          userId: ctx.session.user.id,
          flashcardId: input.flashcardId,
        })
        .returning();
    }),
  delete: protectedProcedure
    .input(z.object({ flashcardId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      return await ctx.db
        .delete(StarredFlashcard)
        .where(
          and(
            eq(StarredFlashcard.userId, ctx.session.user.id),
            eq(StarredFlashcard.flashcardId, input.flashcardId),
          ),
        );
    }),
} satisfies TRPCRouterRecord;
